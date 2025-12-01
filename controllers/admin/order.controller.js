import { Op } from "sequelize";
import { getAllOrders, getOrderDetails } from "../../services/index.js";

const SORT_MAP = {
  date_desc:        [["created_at", "DESC"]],
  date_asc:         [["created_at", "ASC"]],
  amount_desc:      [["total_price", "DESC"]],
  amount_asc:       [["total_price", "ASC"]],
  order_number_asc: [["order_number", "ASC"]],
  order_number_desc:[["order_number", "DESC"]],
};


function startOfDayISO(dateStr) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}
function endOfDayISO(dateStr) {
  return new Date(`${dateStr}T23:59:59.999Z`);
}

export const orderController = {
  getAllOrders: async (req, res) => {
    const { q, mail, status, from, to, sort } = req.query;

    const where = {};
    if (q && q.trim().toLowerCase() !== "") {
      where.order_number = { [Op.iLike]: `%${q.trim().toLowerCase()}%` };
    }
    if (from) where.created_at = { ...(where.created_at || {}), [Op.gte]: startOfDayISO(from) };
    if (to)   where.created_at = { ...(where.created_at || {}), [Op.lte]: endOfDayISO(to) };

    const order = SORT_MAP[sort] || SORT_MAP.date_desc;

    const includeFilters = {
      user:   (mail && mail.trim().toLowerCase() !== "") ? { mail: { [Op.iLike]: `%${mail.trim().toLowerCase()}%` } } : null,
      payment: (status && status.trim() !== "") ? { status: status.trim().toLowerCase() } : null,
    };
    const orders = await getAllOrders(where, order, includeFilters);
    console.log(orders);
    res.render("manageOrders", { orders, title: "Gestion des commandes - Greenroots" });
  },

  getOrderDetails: async (req, res) => {
    const order = await getOrderDetails(req.params.id);
    res.render("orderDetail", { order, title: "Détails de la commande - Greenroots" });
  }
};