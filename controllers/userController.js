import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.js";



export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const register = async (req, res) => {
  try {

    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Не удалось зарегестрироваться" });
  }
};

export const getMe = async (req, res) => {
    try {
      const user = await UserModel.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({
          message: "Пользователь не найден",
        });
      }
  
      const { passwordHash, ...userData } = user._doc;
  
      res.json({
        ...userData
      });
    } catch (err) {
      return res.status(503).json({ message: "Не удалось получить профиль" });
    }
  }