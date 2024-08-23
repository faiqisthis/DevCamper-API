import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
      },
      email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
      },
      password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });
    // Get JWT token
    userSchema.methods.getSignedJwtToken = function() {
      return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });
    };

    userSchema.methods.getResetPasswordToken=async function(){
      const resetToken=crypto.randomBytes(20).toString('hex')
      this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
      this.resetPasswordExpire=Date.now()+10*60*1000
      await this.save()
      return resetToken;
    }

    // Match user entered password to hashed password in database
   userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
   }
    

    //Encrypt password using bcrypt
    userSchema.pre('save',async function(next){
      if(!this.isModified('password')){
        next();
      }
      const salt=await bcrypt.genSaltSync(10);
      this.password=await bcrypt.hash(this.password,salt);

    })

const userModel = mongoose.model('User', userSchema);
export default userModel;