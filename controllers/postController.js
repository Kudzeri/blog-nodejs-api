import PostModel from "../models/post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      slug: req.body.slug,
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(503).json({ message: "Не удалось создать пост" });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Не удалось получить посты" });
  }
};

export const getOne = async (req, res) => {
  try {
    const slug = req.params.slug;

    const post = await PostModel.findOne({ slug }).populate("user").exec();
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    post.viewsCount++;
    post.save();

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Не удалось получить пост" });
  }
};

export const update = async (req, res) => {
  try {
    const slug = req.params.slug;

    const post = await PostModel.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    if (post.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "У вас нет прав на изменение этого поста" });
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      { slug },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        updatedAt: Date.now(),
      },
      {
        new: true,
      }
    ).exec();

    return res.json(updatedPost);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: true, message: "Не удалось обновить пост" });
  }
};

export const destroy = async (req, res) => {
  try {
    const slug = req.params.slug;

    const post = await PostModel.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    if (post.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "У вас нет прав на изменение этого поста" });
    }

    post.deleteOne().exec();

    return res.json({ message: "Пост удален" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Не удалось удалить пост" });
  }
};

export const lastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 3);

    return res.json(tags);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Не удалось получить теги" });
  }
};
