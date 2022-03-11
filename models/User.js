const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// schema // 1
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "ID를 입력해주세요!"],
      match: [/^.{4,12}$/, "4글자이상, 12글자이하만 가능합니다!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "비밀번호를 입력해주세요!"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "이름을 입력해주세요!"],
      // match:[/^.{4,12}$/,'4글자이상, 12글자이하만 가능합니다!'],
      trim: true,
    },
    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "이메일 형식에 맞게 작성해주세요!",
      ],
      trim: true,
    },
  },
  {
    toObject: { virtuals: true },
  }
);

// virtuals // 2
userSchema
  .virtual("passwordConfirmation")
  .get(function () {
    return this._passwordConfirmation;
  })
  .set(function (value) {
    this._passwordConfirmation = value;
  });

userSchema
  .virtual("originalPassword")
  .get(function () {
    return this._originalPassword;
  })
  .set(function (value) {
    this._originalPassword = value;
  });

userSchema
  .virtual("currentPassword")
  .get(function () {
    return this._currentPassword;
  })
  .set(function (value) {
    this._currentPassword = value;
  });

userSchema
  .virtual("newPassword")
  .get(function () {
    return this._newPassword;
  })
  .set(function (value) {
    this._newPassword = value;
  });

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage =
  "알파벳과 숫자가 포함된 8자이상, 16자이하의 비밀번호작성이 가능합니다!";
userSchema.path("password").validate(function (v) {
  var user = this; // 3-1

  // create user
  if (user.isNew) {
    if (!user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호 확인이 필요합니다!");
    }

    if (!passwordRegex.test(user.password)) {
      user.invalidate("password", passwordRegexErrorMessage);
    } else if (user.password !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호가 틀렸습니다!");
    }
  }

  // update user
  if (!user.isNew) {
    if (!user.currentPassword) {
      user.invalidate("currentPassword", "비밀번호를 입력해주세요!");
    } else if (
      !bcrypt.compareSync(user.currentPassword, user.originalPassword)
    ) {
      user.invalidate("currentPassword", "비밀번호가 틀렸습니다!");
    }

    if (user.newPassword && !passwordRegex.test(user.newPassword)) {
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if (user.newPassword !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호가 틀렸습니다!");
    }
  }
});

// hash password
userSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) {
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

// model methods
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

// model & export
const User = mongoose.model("user", userSchema);
module.exports = User;
