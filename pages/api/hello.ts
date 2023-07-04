// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  email: string;
  project: string;
};

type ErrorResponse = {
  error: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method === "POST") {
    const { email, project } = req.body;

    console.log("Here's the email:", email);
    console.log("Here's the project:", project);

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
