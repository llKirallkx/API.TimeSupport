module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        nsr: Number,
        date: { type: Date, default: Date.now },
        __v: { type: Number, select: false}
      }
    );
    const Afd = mongoose.model("afd", schema);
    return Afd;
  };
  