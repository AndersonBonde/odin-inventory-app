const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const [allItems, allCategories] = await Promise.all([
    Item.find().populate('category').exec(),
    Category.find().sort({ name: 1 }).exec()
  ]);

  const data = {
    title: 'Category List',
    item_list: allItems,
    category_list: allCategories,
  };
  res.render('category_list', { data });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name').exec()
  ]);

  if (category === null) {
    // Not found.
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  const data = {
    category,
    title: 'Category Detail',
    category_items: categoryItems,
  };
  res.render('category_detail', { data });
});

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
  const data = { title: 'Create Category' };
  res.render('category_form', { data });
};

// Display Category create on POST.
exports.category_create_post = [
  // Validate and sanitize fields.
  body('name', 'Category name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a new category object with escaped and trimmed data.
    const category = new Category({ 
      name: req.body.name, 
      description: req.body.description, 
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values & error messages.
      const data = {
        category,
        title: 'Create Category',
        errors: errors.array(),
      };
      res.render('category_form', { data });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of category and all their items.
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name').exec()
  ]);

  if (category === null) {
    // No result.
    res.redirect('/inventory/categories');
  }

  const data = {
    category,
    categoryItems,
    title: 'Delete Item',
  };
  res.render('category_delete', { data });
});

// Display Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of category and all their items.
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name').exec()
  ]);
  
  if (categoryItems.length > 0) {
    // Category has items. Render in same way as for GET route.
    const data = {
      category,
      categoryItems,
      title: 'Delete Item',
    };

    res.render('category_delete', { data });
    return;
  } else {
    // Category has no items. Delete object and redirect.
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect('/inventory/categories');
  }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  // Get category info.
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results.
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  const data = {
    category,
    title: 'Update Category',
  };
  res.render('category_form', { data });
});

// Display Category update on POST.
exports.category_update_post = [
  // Validate and sanitize fields.
  body('name', 'Category name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped/trimmed data and old id.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // Required, or a new ID will be assigned.
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      
      const data = {
        category,
        title: 'Update Category',
        errors: errors.array(),
      };
      res.render('category_form', { data });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category);
      // Redirect to category detail page.
      res.redirect(updatedCategory.url);
    }
  }),
]
