import { Router } from "express";
import { campaignRouter } from "./campaign.routes.js";
import { authRouter } from "./auth.routes.js";
import { treeRouter } from "./tree.routes.js";
import { userRouter } from "./user.routes.js";
import { orderRouter } from "./order.routes.js";
import { contactRouter } from "./contact.routes.js";
import { paymentsRouter } from "./payments.route.js";
import { adminRouter } from "./admin.routes.js";
import { wishlistRouter } from "./wishlist.routes.js";

export const apiRouter = Router();

// Define your routes here

apiRouter.use("/auth",authRouter);
apiRouter.use("/campaigns", campaignRouter);
apiRouter.use("/trees", treeRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/contact",contactRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/wishlists", wishlistRouter);
