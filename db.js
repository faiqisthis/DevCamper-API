import mongoose from 'mongoose'
const connect=async() => {
  const conn=await mongoose.connect(process.env.MONGO_URI)

  console.log(`MongoDB Connected: ${conn.connection.host}`.blue.inverse)
}

export default connect
