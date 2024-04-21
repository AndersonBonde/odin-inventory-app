const Item = require('../models/item');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  const data = {
    title: 'Home Page',
  }
  res.render('index', { data });
});

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item list');
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  res.send(`TODO: Item detail: ${req.params.id}`);
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item create GET');
});

// Display item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item create POST');
});

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item delete GET');
});

// Display item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item delete POST');
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item update GET');
});

// Display item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item update POST');
});
