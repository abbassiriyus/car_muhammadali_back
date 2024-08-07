const pool =require("../db");
const router=require('express').Router()

// Ma'lumotlarni olish
router.get('/carscount', async (req, res) => {
  try {
   var car

    if(req.query && (req.query.category || req.query.subcategory)){
  
   if(req.query.category && req.query.subcategory){
     car = await pool.query(`
    SELECT *
    FROM car
    WHERE category = $1 AND subcategory = $2
  `, [req.query.category, req.query.subcategory]);
  await pool.query('UPDATE subcategory SET looking = looking + 1 WHERE id = $1', [req.query.subcategory]);
  await pool.query('UPDATE category SET looking = looking + 1 WHERE id = $1', [req.query.category]);
    }else if(req.query.category){
       car = await pool.query('SELECT * FROM car WHERE category = $1', [req.query.category])
       await pool.query('UPDATE category SET looking = looking + 1 WHERE id = $1', [req.query.category]);
    }else{
       car = await pool.query('SELECT * FROM car WHERE subcategory = $1', [req.query.subcategory])
       await pool.query('UPDATE subcategory SET looking = looking + 1 WHERE id = $1', [req.query.subcategory]);
    }


    }else{
        car = await pool.query('SELECT * FROM car LIMIT 100');
    }

var a=car.rows

if (req.query &&  req.query.year) {
a=a.filter(item=>item.year==req.query.year)
}

    res.json(a);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: error.message });
  }
});


// Ma'lumotlarni olish
router.get('/cars', async (req, res) => {
    try {
     var car
  
      if(req.query && (req.query.category || req.query.subcategory)){
    
     if(req.query.category && req.query.subcategory){
       car = await pool.query(`
      SELECT *
      FROM car
      WHERE category = $1 AND subcategory = $2
    `, [req.query.category, req.query.subcategory]);
    await pool.query('UPDATE subcategory SET looking = looking + 1 WHERE id = $1', [req.query.subcategory]);
    await pool.query('UPDATE category SET looking = looking + 1 WHERE id = $1', [req.query.category]);
      }else if(req.query.category){
         car = await pool.query('SELECT * FROM car WHERE category = $1', [req.query.category])
         await pool.query('UPDATE category SET looking = looking + 1 WHERE id = $1', [req.query.category]);
      }else{
         car = await pool.query('SELECT * FROM car WHERE subcategory = $1', [req.query.subcategory])
         await pool.query('UPDATE subcategory SET looking = looking + 1 WHERE id = $1', [req.query.subcategory]);
      }


      }else{
          car = await pool.query('SELECT * FROM car');
      }

 var a=car.rows

if (req.query &&  req.query.year) {
 a=a.filter(item=>item.year==req.query.year)
}

      res.json(a);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: error.message });
    }
  });
  

  router.get('/cars/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Increment the 'looking' value
      await pool.query('UPDATE car SET looking = looking + 1 WHERE id = $1', [id]);
  
      // Fetch the updated car
      const car = await pool.query('SELECT * FROM car WHERE id = $1', [id]);
      if (car.rows.length === 0) {
        return res.status(404).json({ message: 'Car not found' });
      }

      const car_image = await pool.query('SELECT * FROM car_image WHERE car_id = $1', [car.rows[0].id]);
      const category = await pool.query('SELECT * FROM category WHERE id = $1', [car.rows[0].category]);
      const subcategory = await pool.query('SELECT * FROM subcategory WHERE id = $1', [car.rows[0].subcategory]);

car.rows[0].make=category.rows[0].title
car.rows[0].all_img=car_image.rows
if(car.rows[0].image){
  car.rows[0].all_img.unshift({image:car.rows[0].image})
}
car.rows[0].model=subcategory.rows[0].title
      res.json(car.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  // Ma'lumot qo'shish
  router.post('/cars', async (req, res) => {
    const {
      title,
      image,
      listing_id,
      price,
      year,state,
      interior_color,
      exterior_color,
      transmission,
      odometer,
      subcategory,
      category,
      power_windows,
      air_conditioning,
      power_brakes,
      engine_condition,
      location,
      description,user_id
    } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO car (title, image, listing_id, price, year, interior_color, exterior_color, transmission, odometer, subcategory, category, power_windows, air_conditioning, power_brakes, engine_condition, location, description,state,user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,$18,$19) RETURNING *',
        [
          title,
          image,
          listing_id,
          price,
          year,
          interior_color,
          exterior_color,
          transmission,
          odometer,
          subcategory,
          category,
          power_windows,
          air_conditioning,
          power_brakes,
          engine_condition,
          location,
          description,state,user_id
        ]
      );
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: error.message});
    }
  });
  
  // Ma'lumotni yangilash
  router.put('/cars/:id', async (req, res) => {
    const { id } = req.params;
    const {
      title,
      image,
      listing_id,
      price,
      year,
      interior_color,
      exterior_color,
      transmission,
      odometer,
      subcategory,
      category,
      power_windows,
      air_conditioning,
      power_brakes,
      engine_condition,
      location,
      description,
      state,user_id
    } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE car SET title = $1, image = $2, listing_id = $3, price = $4, year = $5, interior_color = $6, exterior_color = $7, transmission = $8, odometer = $9, subcategory = $10, category = $11, power_windows = $12, air_conditioning = $13, power_brakes = $14, engine_condition = $15, location = $16, description = $17,state=$18,user_id=$19, time_update = current_timestamp WHERE id = $20 RETURNING *',
        [
          title,
          image,
          listing_id,
          price,
          year,
          interior_color,
          exterior_color,
          transmission,
          odometer,
          subcategory,
          category,
          power_windows,
          air_conditioning,
          power_brakes,
          engine_condition,
          location,
          description,state,user_id,
          id,
        ]
      );
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: error.message});
    }
  });
  
  // Ma'lumotni o'chirish
  router.delete('/cars/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM car WHERE id = $1 RETURNING *', [id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: error.message});
    }
  });
  
  module.exports=router