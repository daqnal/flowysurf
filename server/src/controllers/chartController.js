import { prisma } from "../config/db";

const createChart = async (req, res) => {
  const { name, ownerId } = req.body;

  if (!name) {
    // TODO: Update name depending on how many unnamed charts there are
    name = "Unnamed Chart";
  }

  if (!ownerId) {
    // In future, add more extensive checks to make sure user is correct
    return res.status(400).json({ error: "Owner ID not provided" });
  }

  const chart = prisma.chart.create({
    data: {
      name,
      ownerId,
      data: {},
      user: prisma.user.findUnique({
        where: { id: ownerId },
      }),
    },
  });
};

const updateChart = async (req, res) => {};

const importChart = async (req, res) => {};

const deleteChart = async (req, res) => {
  const chart = await prisma.chart.findUnique({
    where: { id: req.params.id },
  });

  if (!chart) {
    return res.status(404).json({ error: "Chart to be deleted not found" });
  }

  // Ensure only owner can delete
  if (chart.userId !== req.user.id) {
    return res.status(403).json({ error: "Not allowed to delete this chart" });
  }

  await prisma.chart.deleteChart(chart);
};

export { createChart, updateChart, importChart, deleteChart };
