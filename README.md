# VaccineNotifier
VaccineNotifier checks the cowin portal periodically to find vaccination slots available in your pin code and for your age. If found, it will send you emails every minute until the slots are available.


<font size="6"> Steps to run the script: </font> 

Step 1) Enable application access on your gmail with steps given here:
https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637554658548216477-2576856839&rd=1  
\
Step 2) Create a .env file as per the following template
\
\
ENABLE_EMAIL=1
\
ENABLE_MSG91_SMS=1
\
SENDER_EMAIL=your@email.com
\
EMAIL_APPLICATION_PASSWORD=XXXXXXXXXX
\
MSG91_API_KEY=XXXXXXXXXXXXXXXXXXXX
\
MSG91_SENDER_ID=XXXX
\
\
Step 3) Create a data file called data.csv in root of the project as per the following template
\
\
email,phone,pincode,age
\
someemail@domain.com,91987654321,380013,32
\
someotheremail@domain.com,919988776655,380014,54
\
\
Step 4) On your terminal run: npm i && pm2 start vaccineNotifier.js
\
\
To close the app run: pm2 stop vaccineNotifier.js && pm2 delete vaccineNotifier.js

Here's a sample of the resultant emails:
![image info](./sampleEmail.png)
