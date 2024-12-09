import { Request, Response, NextFunction } from "express";

const formidable = require("formidable");
const fs = require("fs");

const getLastMessage = async (myId: string, fdId: string) => {
  const msg = await prisma.message.findFirst({
    where: {
      OR: [
        {
          AND: [{ senderId: myId }, { reseverId: fdId }],
        },
        {
          AND: [{ senderId: fdId }, { reseverId: myId }],
        },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return msg;
};

module.exports.getFriends = async (req: Request, res: Response) => {
  const myId = req.body.myId;
  let fnd_msg: any[] = [];
  try {
    const friendGet = await prisma.user.findMany({
      where: {
        id: {
          not: myId,
        },
      },
    });
    for (let i = 0; i < friendGet.length; i++) {
      let lmsg = await getLastMessage(myId, friendGet[i].id);
      fnd_msg = [
        ...fnd_msg,
        {
          fndInfo: friendGet[i],
          msgInfo: lmsg,
        },
      ];
    }

    res.status(200).json({ success: true, friends: fnd_msg });
  } catch (error) {
    res.status(500).json({
      message:  "Internal Server Error",
    });
  }
};

module.exports.messageUploadDB = async (req: Request, res: Response) => {
  const { senderName, reseverId, message } = req.body;
  const senderId = req.body.myId;

  try {
    const insertMessage = await prisma.message.create({
      data: {
        senderId: senderId,
        senderName: senderName,
        reseverId: reseverId,
        message: {
          text: message,
          image: "",
        },
      },
    });
    res.status(201).json({
      success: true,
      message: insertMessage,
    });
  } catch (error) {
    res.status(500).json({
        message: "Internal Server Error",
    });
  }
};

module.exports.messageGet = async (req: Request, res: Response) => {
  const myId = req.body.myId;
  const fdId = req.params.id;

  try {
    const getAllMessage = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: myId },
              { reseverId: fdId },
            ],
          },
          {
            AND: [
              { senderId: fdId },
              { reseverId: myId },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      message: getAllMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server error",
      },
    });
  }
};

module.exports.ImageMessageSend = (req: Request, res: Response) => {
  const senderId = req.body.myId;
  const form = formidable();

  form.parse(req, (err: any, fields: any, files: any) => {
    const { senderName, reseverId, imageName } = fields;

    const newPath = __dirname + `../../../frontend/public/image/${imageName}`;
    files.image.originalFilename = imageName;

    try {
      fs.copyFile(files.image.filepath, newPath, async (err: any) => {
        if (err) {
          res.status(500).json({
            error: {
              errorMessage: "Image upload fail",
            },
          });
        } else {
          const insertMessage = await prisma.message.create({
            data: {
              senderId: senderId,
              senderName: senderName,
              reseverId: reseverId,
              message: {
                text: "",
                image: files.image.originalFilename,
              },
            },
          });
          res.status(201).json({
            success: true,
            message: insertMessage,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: "Internal Server Error",
        },
      });
    }
  });
};

module.exports.messageSeen = async (req: Request, res: Response) => {
  const messageId = req.body._id;
  try {
    await prisma.message.update({
      where: { id: messageId },
      data: { status: "seen" },
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server Error",
      },
    });
  }
};

module.exports.delivaredMessage = async (req: Request, res: Response) => {
  const messageId = req.body._id;

  try {
    await prisma.message.update({
      where: { id: messageId },
      data: { status: "delivared" },
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server Error",
      },
    });
  }
};
