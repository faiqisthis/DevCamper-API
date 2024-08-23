
const getAdvancedResults=(model,populate) => async(req,res,next)=>{
    let query;
    const reqQuery = { ...req.query };
    //Removing fields from query
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    
    // Create query string for filtering
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    // Finding resource
    query = model.find(JSON.parse(queryStr))
    if(populate){
        query=query.populate(populate)
    }
    // Handle select fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" "); //Splitting the fields on comma and joining them with space. Split method creates an array and join method converts the array into string
      query = query.select(fields);
    }
    if(req.query.sort){
      const sortBy=req.query.sort.split(',').join(' ') //if i write '-name' in sort query, it will sort in descending order
      query=query.sort(sortBy)
    } else {
      query = query.sort('-createdAt'); // Default sort by creation date
    }
    
    // Pagination
    const page=parseInt(req.query.page,10) || 1;
    const limit=parseInt(req.query.limit,10) || 15;
    const startIndex=(page-1)*limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(JSON.parse(queryStr));
    query.skip(startIndex).limit(limit);
    const results = await query;
  
    // Pagination result
    const pagination = {};
  
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
  
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
  
    res.advancedResults={ success: true, count: results.length,pagination, data: results };
    next();
}
export default getAdvancedResults;