const { get } = require("mongoose");
const Course = require("../models/course.model");

const getCourses = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["sort", "search", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let filterQuery = {}; // Inisialisasi objek filter Mongoose yang akan dibangun

    // Loop melalui queryObj yang sudah difilter
    for (const key in queryObj) {
      if (queryObj.hasOwnProperty(key)) {
        const value = queryObj[key];

        // Cek apakah kunci mengandung operator seperti [gt], [gte], [lt], [lte]
        const match = key.match(/\[(gt|gte|lt|lte)\]/);
        if (match) {
          const fieldName = key.replace(match[0], ''); // Ambil nama field, cth: 'harga'
          const operator = `$${match[1]}`; // Ambil operator Mongoose, cth: '$lt'

          // Konversi nilai menjadi angka jika operatornya adalah numerik
          // Ini penting karena nilai dari req.query adalah string
          const parsedValue = isNaN(Number(value)) ? value : Number(value);

          // Pastikan fieldName sudah ada sebagai objek di filterQuery
          if (!filterQuery[fieldName]) {
            filterQuery[fieldName] = {};
          }
          // Tambahkan operator ke objek fieldName
          filterQuery[fieldName][operator] = parsedValue;

        } else {
          // Jika tidak ada operator, itu adalah filter standar (cth: ?kategori=frontend)
          filterQuery[key] = value;
        }
      }
    }

    // 3. SEARCHING (WHERE...LIKE)
    // Contoh dari frontend: ?search=javascript
    if (req.query.search) {
      // $or memungkinkan pencarian di beberapa field sekaligus
      const searchQuery = {
        $or: [
          // Cari di field 'judul' dengan case-insensitive
          { judul: { $regex: req.query.search, $options: "i" } },
          // Anda bisa menambahkan field lain untuk dicari, misal description
          // { description: { $regex: req.query.search, $options: 'i' } },
        ],

        
      };
      // Gabungkan filter dasar dengan filter pencarian
      filterQuery = { ...filterQuery, ...searchQuery };
    }

    // Memulai query Mongoose dengan filter yang sudah dibuat
    let query = Course.find(filterQuery);

    // 2. SORTING (ORDER BY)
    // Contoh dari frontend: ?sort=-price,judul
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      // Default sorting jika tidak ada query sort (urutkan berdasarkan yang terbaru)
      query = query.sort("-createdAt");
    }

    // (BONUS) PAGINATION - Sangat penting untuk API yang baik
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // default 10 item per halaman
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Eksekusi query untuk mendapatkan data kursus
    const courses = await query;
    // Hitung total dokumen yang cocok dengan filter (untuk info pagination)
    const totalCourses = await Course.countDocuments(filterQuery);

    res.status(200).json({
      status: "success",
      totalResults: totalCourses,
      resultsOnPage: courses.length,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: " Course not Found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updateCourse = await Course.findById(id);
    res.status(200).json(updateCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ message: " Course not Found" });
    }
    res.status(200).json({ message: "Course deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
