import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  Path: {
    type: String,
  },
  Size: {
    type: Number,
  },
  LastAccessTime: {
    type: String,
  },
  CreatedAt: {
    type: String,
  },
  Name: {
    type: String,
  },
  ThumbNail: {
    type: String,
  },
  Type: {
    type: String,
  },
});

videoSchema.methods.getVideoList = function ({
  skip,
  limit,
}: {
  skip: number;
  limit: number;
}) {
  console.log(skip, limit);
};

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default Video;
