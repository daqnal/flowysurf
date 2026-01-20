import { prisma } from "../config/db.js";

const getCharts = async (req, res) => {
  const charts = await prisma.chart.findMany({
    where: { ownerId: req.user.id }
  })
  res.json(charts);
}

const createChart = async (req, res) => {
  const { name, ownerId } = req.body;

  if (!name) {
    // TODO: Update name depending on how many unnamed charts there are
    name = "Unnamed Chart";
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

  res.status(201).json(chart);
};

const updateChart = async (req, res) => { };

const importChart = async (req, res) => { };

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

export { getCharts, createChart, updateChart, importChart, deleteChart };
