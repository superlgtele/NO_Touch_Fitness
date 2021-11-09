const mongoose = require('mongoose');

// schema // 1
const userSchema = mongoose.Schema({
  username:{type:String, required:[true,'ID를 입력해주세요!'], unique:true},
  password:{type:String, required:[true,'비밀번호를 입력해주세요!'], select:false},
  name:{type:String, required:[true,'이름을 입력해주세요!']},
  email:{type:String}
},{
  toObject:{virtuals:true}
});

// virtuals // 2
userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
  .get(function(){ return this._originalPassword; })
  .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
  .get(function(){ return this._currentPassword; })
  .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
  .get(function(){ return this._newPassword; })
  .set(function(value){ this._newPassword=value; });

// password validation // 3
userSchema.path('password').validate(function(v) {
  var user = this; // 3-1

  // create user // 3-3
  if(user.isNew){ // 3-2
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', '비밀번호 확인이 필요합니다!');
    }

    if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', '비밀번호가 맞지 않습니다!');
    }
  }

  // update user // 3-4
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    else if(user.currentPassword != user.originalPassword){
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }

    if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});

// model & export
const User = mongoose.model('user',userSchema);
module.exports = User;