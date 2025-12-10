const { sequelize, User, SignupToken } = require('./models');
const crypto = require('crypto');
require('dotenv').config();

const students = [
  { rollNumber: 'CSC1', name: 'ABHIJITH S' },
  { rollNumber: 'CSC2', name: 'ABHIRAM R' },
  { rollNumber: 'CSC3', name: 'ADELYNE MISHA MITESH' },
  { rollNumber: 'CSC4', name: 'ADHARSH K' },
  { rollNumber: 'CSC5', name: 'ADVAID MOHAN' },
  { rollNumber: 'CSC6', name: 'AEBEL ANTOSH' },
  { rollNumber: 'CSC7', name: 'AJAY AJITH NAIR' },
  { rollNumber: 'CSC8', name: 'ALBERT BIJU' },
  { rollNumber: 'CSC9', name: 'ALEENA GEORGE SUNIL' },
  { rollNumber: 'CSC10', name: 'ALVIN GEORGE' },
  { rollNumber: 'CSC11', name: 'AMAN EDAMANA SELMAN' },
  { rollNumber: 'CSC12', name: 'ANAGHA ANILKUMAR' },
  { rollNumber: 'CSC13', name: 'ANANTHAKRISHNAN UNNI' },
  { rollNumber: 'CSC14', name: 'ANNA CATHERENE' },
  { rollNumber: 'CSC15', name: 'ANNA SARA JOJI' },
  { rollNumber: 'CSC16', name: 'ARCHANA SEKHAR' },
  { rollNumber: 'CSC17', name: 'ARSHIYA K N' },
  { rollNumber: 'CSC18', name: 'ASIM ROSHAN K' },
  { rollNumber: 'CSC19', name: 'ASWIN CHERUKARAYIL BIJU' },
  { rollNumber: 'CSC20', name: 'AVANTHIKA SREEJITH' },
  { rollNumber: 'CSC21', name: 'BASIL SAMAN M' },
  { rollNumber: 'CSC22', name: 'CHANJAL KRISHNA P S' },
  { rollNumber: 'CSC23', name: 'DEEYA MARIA SAJEEV' },
  { rollNumber: 'CSC24', name: 'DHARITHRY JYODISH' },
  { rollNumber: 'CSC26', name: 'DRUPAD PRAVEEN' },
  { rollNumber: 'CSC27', name: 'EWAN JOHN DENNIS' },
  { rollNumber: 'CSC28', name: 'FATHIMATHU ZAHRA' },
  { rollNumber: 'CSC29', name: 'G S BALAMURALI' },
  { rollNumber: 'CSC30', name: 'GAUTHAM P SAJITH' },
  { rollNumber: 'CSC31', name: 'GEORGE ALEX VALLUVASSERY' },
  { rollNumber: 'CSC32', name: 'HASHIM MOHAMED T A' },
  { rollNumber: 'CSC33', name: 'IHSAN MUHAMMED K P' },
  { rollNumber: 'CSC34', name: 'JAIN SAJI' },
  { rollNumber: 'CSC35', name: 'JEESON PAUL AJITH' },
  { rollNumber: 'CSC36', name: 'JISHNU S NAMBOOTHIRIPAD' },
  { rollNumber: 'CSC37', name: 'JIYA SANTHOSH' },
  { rollNumber: 'CSC38', name: 'JOHAN ABRAHAM' },
  { rollNumber: 'CSC39', name: 'JOVITA ROSE AMBADAN' },
  { rollNumber: 'CSC40', name: 'JYOTHIKA G' },
  { rollNumber: 'CSC41', name: 'KAVYA AJO' },
  { rollNumber: 'CSC42', name: 'KHANSA SHAHAN S' },
  { rollNumber: 'CSC43', name: 'KSHEMDIN KUMAR K K' },
  { rollNumber: 'CSC44', name: 'LINSA VINOD' },
  { rollNumber: 'CSC45', name: 'MADHAV R' },
  { rollNumber: 'CSC46', name: 'MERRYL JOHNS' },
  { rollNumber: 'CSC47', name: 'MEVIN PORATHUR' },
  { rollNumber: 'CSC48', name: 'MOHAMMAD NAUMAN FAYAZ SHAH' },
  { rollNumber: 'CSC49', name: 'MUHAMMAD ZENIN P' },
  { rollNumber: 'CSC50', name: 'NAVANEETH KRISHNAN N S' },
  { rollNumber: 'CSC51', name: 'NEHA JOE' },
  { rollNumber: 'CSC52', name: 'NIDHIN WILSON' },
  { rollNumber: 'CSC53', name: 'NOEL SONISH' },
  { rollNumber: 'CSC54', name: 'P S SOORAJ' },
  { rollNumber: 'CSC55', name: 'RAMKIRAN P' },
  { rollNumber: 'CSC56', name: 'REYNA MARY JOHN' },
  { rollNumber: 'CSC57', name: 'RICHA DEVARAJ' },
  { rollNumber: 'CSC58', name: 'RISVAN SAFEER' },
  { rollNumber: 'CSC59', name: 'ROHAN K JOSEPH' },
  { rollNumber: 'CSC60', name: 'ROSHAN R' },
  { rollNumber: 'CSC61', name: 'SACHIN RAJESH' },
  { rollNumber: 'CSC62', name: 'SANDRA ANNA BIJU' },
  { rollNumber: 'CSC63', name: 'SERAPHIN JOSEPH RAPHY' },
  { rollNumber: 'CSC64', name: 'SIMON PUTHUR BINU' },
  { rollNumber: 'CSC65', name: 'SNEHA SHABITH' },
  { rollNumber: 'CSC66', name: 'SREENIDHI AJIT' },
  { rollNumber: 'CSC67', name: 'SWATHY UMENDRAN' },
  { rollNumber: 'CSC68', name: 'VAISHNAVI R' },
  { rollNumber: 'CSC69', name: 'ABHIJITH S' },
  { rollNumber: 'CSC70', name: 'ALSHIF RAHAN N P' },
  { rollNumber: 'CSC71', name: 'JOHN THOMAS' },
  { rollNumber: 'CSC72', name: 'MUAD C R' },
  { rollNumber: 'CSC73', name: 'MUHAMMED ANZIL JABBAR' },
  { rollNumber: 'CSC74', name: 'NANDANA SURESH' },
  { rollNumber: 'CSC75', name: 'SREERAJ SREEKUMAR' }
];

const generateTokens = async () => {
  try {
    await sequelize.sync({ force: true });
    
    console.log('Generating tokens for', students.length, 'students...\n');
    
    for (const student of students) {
      const user = await User.create({ ...student, isRegistered: true });
      const token = crypto.randomBytes(32).toString('hex');
      await SignupToken.create({ token, userId: user.id });
      console.log(`${student.rollNumber},${student.name},${token}`);
    }
    
    console.log('\nTokens generated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Token generation failed:', error);
    process.exit(1);
  }
};

generateTokens();