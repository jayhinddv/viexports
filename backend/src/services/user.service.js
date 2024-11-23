import httpStatus from 'http-status';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import moment from 'moment/moment.js';
import { where } from 'sequelize';
export const CreateTender = async (data) => {
  try {
    const tender = await db.Tender.create(data);
    return tender;
  } catch (error) {
    return { success: false, message: error.message };
  }
  };
export const UpdateTender = async(input)=>{
  try {
    const tender = await db.Tender.update({status : input.status},{where:{id:input.id}});
    return {success:true,message:'updated'}
  }catch{
    return {success:false,message:'not updated'}
  }
}
  export const ViewTender = async () => {
    try {
      const tender = await db.Tender.findAll({
        attributes: {
          include: [
            // Add the lowest bid using a subquery
            [
              db.Sequelize.literal(`(
                SELECT MIN(amount)
                FROM Bids
                WHERE Bids.tender_id = Tender.id
              )`),
              "lowest_bid",
            ],
            // Add `isNew` based on the `createdAt` timestamp
            [
              db.Sequelize.literal(`(
                CASE 
                  WHEN TIMESTAMPDIFF(MINUTE, createdAt, NOW()) < 5 THEN 'Y'
                  ELSE 'N'
                END
              )`),
              "isNew",
            ],
          ],
        },
        order: [["createdAt", "DESC"]],
      });
      return tender;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  

    export const Tender = async (id) => {
      try {
        const tender = await db.Tender.findByPk(id);
        return tender;
      } catch (error) {
        return { success: false, message: error.message };
      }
      };

      export const PlaceBid = async (input) => {
        try {
          const tenderId = input.tender_id;
      
          // Fetch the tender's end time and buffer time
          const tender = await db.Tender.findOne({
            where: { id: tenderId },
            attributes: ["end_time", "buffer_time"], // Assuming buffer_time is stored in minutes
          });
      
          if (!tender) {
            return { success: false, message: "Tender not found." };
          }
      
          const endTime = new Date(tender.end_time).getTime();
          const currentTime = new Date().getTime();
          const timeDifference = endTime - currentTime;
      
          // Check if the bid is in the last 5 minutes
          if (timeDifference <= 300000 && timeDifference > 0) {
            input.is_last_minute_bid = 1;
      
            // Update the tender's end time by adding buffer time (convert minutes to milliseconds)
            const bufferTimeMs = tender.buffer_time * 60 * 1000; // buffer_time is assumed to be in minutes
            const newEndTime = new Date(endTime + bufferTimeMs);
      
            await db.Tender.update(
              { end_time: newEndTime },
              { where: { id: tenderId } }
            );
          } else {
            input.is_last_minute_bid = 0;
          }
      
          // Create the bid
          const bid = await db.Bid.create(input);
          return { success: true, bid };
        } catch (error) {
          // Handle errors
          return { success: false, message: error.message };
        }
      };
      
      

        export const ViewBid = async (id) => {
          try {
            // Fetch bids with ascending order by amount
            const bids = await db.Bid.findAll({
              where: { tender_id: id },
              order: [["amount", "ASC"]], // Order by amount in ascending order
              attributes: ["id", "amount", "description","is_last_minute_bid", "createdAt"], // Select specific columns
              include: [
                {
                  model: db.User, // Example: include related User data
                  attributes: ["id", "name"], // Include only required fields
                },
              ],
            });
            return { success: true, data: bids };
          } catch (error) {
            // Return error with success flag
            return { success: false, message: error.message };
          }
        };
        