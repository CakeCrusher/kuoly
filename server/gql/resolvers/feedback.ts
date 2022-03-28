import db from "../../db";
import { QueryResult } from "pg";
import { Context, Metric, MetricType } from "../../types";
import { notExist } from "../../utils/functions";

const feedbackResolvers = {
  Query: {
    getFeedback: async () => {
      const feedbackRes: QueryResult<Metric> = await db.query(
        `SELECT * FROM feedback;`
      );
      return feedbackRes.rows;
    },
  },
  Mutation: {
    createFeedback: async (
      _: null,
      args: { message: string; email?: string },
      { authorization }: Context
    ) => {
      const feedbackRes = await db.query(
        "INSERT INTO feedback (user_id, message, email) VALUES ($1, $2, $3) RETURNING *",
        [authorization, args.message, args.email]
      );
      notExist("Metric", feedbackRes.rows[0]);
      return feedbackRes.rows[0];
    },
  },
  Subscription: {},
};

export default feedbackResolvers;
