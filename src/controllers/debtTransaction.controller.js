import prisma from "../config/prisma.config.js";

export const debtSummary = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const groupUsers = await prisma.groupUser.findMany({
      where: { groupId: Number(groupId) },
      select: { userId: true }
    });
    const groupUserIds = groupUsers.map(gu => gu.userId);

    const splits = await prisma.expenseSplit.findMany({
      where: {
        expense: { groupUser: { groupId: Number(groupId) } }
      },
      include: {
        expense: {
          select: {
            amount: true,
            groupUser: {
              select: { userId: true }
            }
          }
        },
        user: true,
        debtTransaction: true
      }
    });

    const net = {};
    for (const split of splits) {
      const paidBy = split.expense.groupUser.userId;
      const paidFor = split.userId;
      const amount = split.amount;

      if (paidBy === paidFor) continue;

      net[paidFor] = (net[paidFor] || 0) - amount;
      net[paidBy] = (net[paidBy] || 0) + amount;
    }

    const summary = [];
    const debtors = Object.entries(net)
      .filter(([_, v]) => v < 0)
      .map(([id, amount]) => ({ id: Number(id), amount: -amount }));
    const creditors = Object.entries(net)
      .filter(([_, v]) => v > 0)
      .map(([id, amount]) => ({ id: Number(id), amount: amount }));

    while (debtors.length && creditors.length) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const amount = Math.min(debtor.amount, creditor.amount);

      summary.push({
        payerId: debtor.id,
        receiverId: creditor.id,
        groupId: Number(groupId),
        amount,
        status: "INPROGRESS",
        isConfirmed: false
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount === 0) debtors.shift();
      if (creditor.amount === 0) creditors.shift();
    }

    for (const item of summary) {
      let created = await prisma.debtTransaction.findFirst({
        where: {
          payerId: item.payerId,
          receiverId: item.receiverId,
          groupId: item.groupId,
          amount: item.amount,
          status: "INPROGRESS",
          isConfirmed: false
        }
      });

      if (!created) {
        created = await prisma.debtTransaction.create({ data: item });
      }

      // ผูก expenseSplit ที่ยังไม่มี debtTransactionId กับ transaction ที่สร้าง
      const splitsToUpdate = await prisma.expenseSplit.findMany({
        where: {
          debtTransactionId: null,
          userId: item.payerId,
          expense: {
            groupUser: {
              groupId: Number(groupId),
              userId: item.receiverId
            }
          }
        },
      });

      await Promise.all(
        splitsToUpdate.map((split) =>
          prisma.expenseSplit.update({
            where: { id: split.id },
            data: { debtTransactionId: created.id, status: 'PAID' },
          })
        )
      );
    }

    // ลบการอัปเดต split เป็น PAID แบบ mass update ในนี้ออก
    // การอัปเดต status ควรไปทำใน confirmTransaction หรือ uploadSlipController แทน

    res.json({ result: summary });
  } catch (error) {
    next(error);
  }
};

// export const createDebtTransactions = async (req, res, next) => {
//   try {
//     const { groupId } = req.params
//     const { payerId, receiverId, amount, status, slip, note, isConfirmed } = req.body
//     const created = await prisma.debtTransaction.create({
//       data: {
//         payerId: Number(payerId),
//         receiverId: Number(receiverId),
//         groupId: Number(groupId),
//         amount: Number(amount),
//         status: status,
//         slip: slip,
//         note: note,
//         isConfirmed: isConfirmed
//       }
//     })
//     res.json({ result: created })
//   } catch (error) {
//     next(error)
//   }
// }

export const updateDebtTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { slip, note } = req.body;

    const existing = await prisma.debtTransaction.findUnique({
      where: { id: Number(id) }
    });
    if (!existing) return res.status(404).json({ message: "Transaction not found" });

    const updated = await prisma.debtTransaction.update({
      where: { id: Number(id) },
      data: {
        slip,
        note,
        updatedAt: new Date()
      }
    });

    res.json({ result: updated });
  } catch (error) {
    next(error);
  }
};


export const getTransactions = async (req, res, next) => {
  try {
    const { groupId } = req.params
    const transactions = await prisma.debtTransaction.findMany({
      where: { groupId: Number(groupId) },
      include: {
        payer: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ result: transactions })
  } catch (error) {
    next(error)
  }
}

export const confirmTransaction = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await prisma.debtTransaction.update({
      where: { id: Number(id) },
      data: {
        isConfirmed: true,
        status: "COMPLETE",
        updatedAt: new Date()
      },
      include: {
        expenseSplit: true
      }
    })
    await prisma.expenseSplit.updateMany({
      where: {
        debtTransactionId: updated.id
      },
      data: {
        status: "PAID"
      }
    });
    res.json({ result: updated })
  } catch (error) {
    next(error)
  }
}

// export const uploadSlipController = async (req, res) => {
//   try {
//     const transactionId = Number(req.params.id);

//     const currentTransaction = await prisma.debtTransaction.findUnique({
//       where: { id: transactionId },
//     });
//     if (!currentTransaction) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }
//     const { payerId, receiverId, groupId } = currentTransaction;

//     // อัปเดต slip และสถานะ transaction ปัจจุบัน
//     await prisma.debtTransaction.update({
//       where: { id: transactionId },
//       data: {
//         slip: req.file?.path || null,
//         status: "COMPLETE",
//         isConfirmed: true,
//         updatedAt: new Date()
//       },
//     });

//     // อัปเดต expenseSplit ของ transaction ปัจจุบัน ให้เป็น PAID
//     const updatedCurrentSplits = await prisma.expenseSplit.updateMany({
//       where: { debtTransactionId: transactionId },
//       data: { status: "PAID" }
//     });
//     console.log("Updated expenseSplits for current transaction:", updatedCurrentSplits.count);

//     // อัปเดต expenseSplit ของ payerId ที่ยังไม่มี debtTransactionId และ status เป็น UNPAID
//     const updatedPayerSplits = await prisma.expenseSplit.updateMany({
//       where: {
//         userId: payerId,
//         debtTransactionId: null,
//         status: 'UNPAID',
//         expense: {
//           groupUser: {
//             groupId
//           }
//         }
//       },
//       data: {
//         status: 'PAID'
//       }
//     });
//     console.log("Updated expenseSplits for payerId with no debtTransactionId:", updatedPayerSplits.count);

//     // หา transaction อื่น ๆ คู่หนี้เดียวกัน (payer-receiver หรือ receiver-payer) ที่ยังไม่จ่าย
//     const relatedTransactions = await prisma.debtTransaction.findMany({
//       where: {
//         groupId,
//         status: { not: "COMPLETE" },
//         OR: [
//           { payerId, receiverId },
//           { payerId: receiverId, receiverId: payerId },
//         ],
//       },
//       select: { id: true },
//     });
//     console.log("Related splits count:", relatedSplits.length);

//     const relatedTransactionIds = relatedTransactions.map(t => t.id);

//     if (relatedTransactionIds.length > 0) {
//       // อัปเดตสถานะ transaction เหล่านั้นให้เป็น COMPLETE
//       const updatedTransactions = await prisma.debtTransaction.updateMany({
//         where: { id: { in: relatedTransactionIds } },
//         data: { status: "COMPLETE" }
//       });
//       console.log("Updated related debtTransactions:", updatedTransactions.count);

//       // อัปเดต expenseSplit ที่เชื่อมกับ transaction เหล่านั้น ให้เป็น PAID
//       const updatedRelatedSplits = await prisma.expenseSplit.updateMany({
//         where: { debtTransactionId: { in: relatedTransactionIds } },
//         data: { status: "PAID" }
//       });
//       console.log("Updated expenseSplits for related transactions:", updatedRelatedSplits.count);
//     }

//     // เพิ่มอัปเดต expenseSplit ของ payerId และ receiverId ที่ยังไม่เป็น PAID ในกลุ่มเดียวกัน
//     const updatedUserSplits = await prisma.expenseSplit.updateMany({
//       where: {
//         status: { not: 'PAID' },
//         userId: { in: [payerId, receiverId] },
//         expense: {
//           groupUser: {
//             groupId
//           }
//         }
//       },
//       data: {
//         status: 'PAID'
//       }
//     });
//     console.log("Updated expenseSplits for payerId and receiverId in group:", updatedUserSplits.count);

//     return res.json({
//       message: "Slip uploaded and all related debts marked as PAID",
//     });
//   } catch (err) {
//     console.error("Upload slip error:", err);
//     return res.status(500).json({ message: "Upload failed", error: err.message });
//   }
// };

export const uploadSlipController = async (req, res) => {
  try {
    const transactionId = Number(req.params.id);

    const currentTransaction = await prisma.debtTransaction.findUnique({
      where: { id: transactionId },
    });
    if (!currentTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const { payerId, receiverId, groupId } = currentTransaction;

    // อัปเดต slip และสถานะ transaction ปัจจุบัน
    await prisma.debtTransaction.update({
      where: { id: transactionId },
      data: {
        slip: req.file?.path || null,
        status: "COMPLETE",
        isConfirmed: true,
        updatedAt: new Date()
      },
    });
    const splitsBefore = await prisma.expenseSplit.findMany({
      where: { debtTransactionId: transactionId }
    });
    console.log("Before update:", splitsBefore);

    // 1. อัปเดต expenseSplit ที่ผูกกับ transaction นี้
    const updatedSplitsWithTx = await prisma.expenseSplit.updateMany({
      where: { debtTransactionId: transactionId },
      data: { status: "PAID" }
    });

    // 2. อัปเดต expenseSplit ที่ยังไม่มี debtTransactionId
    const updatedSplitsWithoutTx = await prisma.expenseSplit.updateMany({
      where: {
        debtTransactionId: null,
        status: { not: "PAID" },
        userId: { in: [payerId, receiverId] },
        expense: {
          groupUser: {
            groupId
          }
        }
      },
      data: { status: "PAID" }
    });

    // *** เพิ่มเติม: อัปเดต expenseSplit ที่อาจมี debtTransactionId อื่นแต่ยังไม่ PAID ***
    await prisma.expenseSplit.updateMany({
      where: {
        debtTransactionId: { not: null },
        status: { not: "PAID" },
        userId: { in: [payerId, receiverId] },
        expense: {
          groupUser: {
            groupId
          }
        }
      },
      data: { status: "PAID" }
    });

    return res.json({
      message: "Slip uploaded and all related debts marked as PAID",
      updatedSplitsWithTx: updatedSplitsWithTx.count,
      updatedSplitsWithoutTx: updatedSplitsWithoutTx.count,
    });
  } catch (err) {
    console.error("Upload slip error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
};