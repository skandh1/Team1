download the app or clone it or pull it whatever..

create a .evn file in the root folder and paste these things
--------------------------------------
PORT = 5000
CLIENT_URL = http://localhost:5173
MONGO_URI = mongodb+srv://shuskason:super321@cluster0.5d70o.mongodb.net/linkedin_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = secret
NODE_ENV = development

MAILTRAP_TOKEN=19ce66f2d978a9e1064b34a620ca39a6
EMAIL_FROM=mailtrap@demomailtrap.com
EMAIL_FROM_NAME=super

CLOUDINARY_API_KEY=192363691924248
CLOUDINARY_API_SECRET=ZMrIw7c5TOHN1ymX2YNnY7iJ7q0
CLOUDINARY_CLOUD_NAME=dpsg8t1mf

CLIENT_URL=http://localhost:5173
----------------------------------

now to run server -> npm run dev --> from root
to run the client -> npm run dev --> from frontend folder -> first cd frontend then -> npm run dev
