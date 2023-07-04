import { NextResponse, NextRequest } from "next/server";
import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_API_KEY });

import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  email: string;
  project: string;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method === "POST") {
    const { email, project } = req.body;

    // const notionData = await notion.databases.query({
    //   database_id: project as string,
    // });

    // console.log("Here's the email:", email);
    // console.log("Here's the project:", project);

    const data: Data = {
      email,
      project,
    };

    res.status(200).json(data);
  } else {
    const errorResponse: ErrorResponse = { error: "Method Not Allowed" };
    res.status(405).json(errorResponse);
  }
}
