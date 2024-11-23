import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { ViewTender as ViewTenderService , CreateTender as CreateTenderService,Tender as TenderService,PlaceBid as PlaceBidService,ViewBid as ViewBidService,
UpdateTender as UpdateTenderService
  } from '../services/user.service.js';

export const CreateTender = catchAsync(async(req,res)=>{
  let input = req.body;
  input.created_by = req.user.id;
  const data = await CreateTenderService(input);
  res.status(httpStatus.CREATED).json({data});
})
export const updateTender = catchAsync(async(req,res)=>{
  try{
  const data = await UpdateTenderService(req.body);
  res.status(httpStatus.OK).json({data});
}
  catch{

  }
})
export const ViewTender = catchAsync(async(req,res) => {
const data = await ViewTenderService(req.user);
res.status(200).send(data);
})
export const Tender = catchAsync(async(req,res) => {
  const data = await TenderService(req.params.id);
  res.status(200).send(data);
  })

  export const PlaceBid = catchAsync(async(req,res) => {
    let input = req.body;
    input.user_id = req.user.id;
    const data = await PlaceBidService(input);
    res.send(data);
    })
export const ViewBid = catchAsync(async(req,res) => {
  const data = await ViewBidService(req.params.tenderId);
  res.status(200).send(data);
  })

