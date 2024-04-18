const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category list');
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  res.send(`TODO: Category detail: ${req.params.id}`);
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category create GET');
});

// Display Category create on POST.
exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category create POST');
});

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category delete GET');
});

// Display Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category delete POST');
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category update GET');
});

// Display Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category update POST');
});
