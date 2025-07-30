import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://keyushghimire023:Mnxh%405fkcdx%253Wk@cluster0.6sgi1kb.mongodb.net/petcare?retryWrites=true&w=majority&appName=Cluster0';

const collections = [
  { name: 'petboardings', service: 'boarding' },
  { name: 'petgroomings', service: 'grooming' },
  { name: 'petsittings', service: 'sitting' },
  { name: 'pettrainings', service: 'training' },
  { name: 'petveterinaries', service: 'veterinary' },
  { name: 'petwalks', service: 'walking' }
];

const bookingSchema = new mongoose.Schema({}, { strict: false });
const Booking = mongoose.model('Booking', bookingSchema, 'bookings'); 
async function migrate() {
  try {
    await mongoose.connect(mongoURI);
    const db = mongoose.connection.db;

    for (const { name, service } of collections) {
      const oldCollection = db.collection(name);
      const oldDocs = await oldCollection.find().toArray();

      
       const newDocs = oldDocs.map(doc => {
        return {
          name: doc.name || 'Unknown',
          email: doc.email || 'N/A',
          petName: doc.petName || 'N/A',
          petType: doc.petType || service,
          date: doc.date ? new Date(doc.date) : new Date(),
          hours: doc.hours || '00:00',
          service
        };
      });

      if (newDocs.length > 0) {
        await Booking.insertMany(newDocs);
        console.log(`✅ Migrated ${newDocs.length} documents from '${name}'`);
      }
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
