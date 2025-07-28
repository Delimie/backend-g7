import prisma from "../config/prisma.config.js";

export const debtSummary = async (req, res, next) => {
  try {
    const { groupId } = req.params
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
        user: true
      }
    })
    console.log(splits)

    const net = {}

    for (const split of splits) {
      console.log(split)
      const paidBy = split.expense.groupUser.userId
      const paidFor = split.userId
      const amount = split.amount

      if (paidBy === paidFor) continue

      net[paidFor] = (net[paidFor] || 0) - amount
      net[paidBy] = (net[paidBy] || 0) + amount
    }
    const summary = []
    const debtors = Object.entries(net)
      .filter(([_, v]) => v < 0)
      .map(([id, amount]) => ({ id: Number(id), amount: -amount }))
    const creditors = Object.entries(net)
      .filter(([_, v]) => v > 0)
      .map(([id, amount]) => ({ id: Number(id), amount: amount }))

    while (debtors.length && creditors.length) {
      const debtor = debtors[0]
      const creditor = creditors[0]
      const amount = Math.min(debtor.amount, creditor.amount)
      summary.push({
        from: debtor.id,
        to: creditor.id,
        amount
      })
      debtor.amount -= amount
      creditor.amount -= amount

      if (debtor.amount === 0) debtors.shift()
      if (creditor.amount === 0) creditors.shift()
    }
    res.json({ result: summary })
  } catch (error) {
    next(error)
  }
}

export const createDebtTransactions = async (req, res, next) => {
  try {
    const { groupId } = req.params
    const { fromUserId, toUserId, amount, status, slip, note, isConfirmed } = req.body
    const created = await prisma.debtTransaction.create({
      data: {
        fromUserId: Number(fromUserId),
        toUserId: Number(toUserId),
        groupId: Number(groupId),
        amount: Number(amount),
        status: status,
        slip: slip,
        note: note,
        isConfirmed: isConfirmed
      }
    })
    res.json({ result: created })
  } catch (error) {
    next(error)
  }
}

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
      }
    })
    res.json({ result: updated })
  } catch (error) {
    next(error)
  }
}