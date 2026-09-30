import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addKeyword, deleteKeyword, getKeyword, getKeywords, refreshKeyword, toggleTracking } from "../controllers/rank.controller.js";

const rankRouter = express.Router();

rankRouter.post('/add-keyword', verifyJWT, addKeyword );
rankRouter.get('/list', verifyJWT, getKeywords );
rankRouter.get('/:id', verifyJWT, getKeyword );
rankRouter.post('/:id/refresh-keyword', verifyJWT, refreshKeyword );
rankRouter.put('/:id/toggle', verifyJWT, toggleTracking  );
rankRouter.delete('/:id', verifyJWT, deleteKeyword  );

export default rankRouter;
