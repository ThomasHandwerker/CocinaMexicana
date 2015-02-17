var RecipeController = function (recipeId, user) {
	this.TAG = 'RecipeHandler => ';

	this.id = recipeId;
	this.template = 'recipe_detail.html';
	this.recipe = null;
	this.user = user;
}

RecipeController.prototype.init = function(callback) {
	var self = this;

	this.loadTemplate(function (event) {
		self.loadRecipe(function (event) {
			if(typeof(callback) === 'function' && callback !== undefined)
				callback('recipe-initialized');
		});
	});
};

RecipeController.prototype.loadTemplate = function(callback) {
	$('#recipeDetail .ui-content').load('content/' + this.template, function () {
		$('#recipeDetail .ui-content').enhanceWithin();

		if(typeof(callback) === 'function' && callback !== undefined)
			callback('template-loaded');
	});
};

RecipeController.prototype.loadRecipe = function(callback) {
	var self = this;

	$.getJSON('content/recipe_' + this.id + '.json', function (recipe) {
		self.recipe = recipe;

		if(typeof(callback) === 'function' && callback !== undefined)
			callback('recipe-received');
	});
};

RecipeController.prototype.parse = function() {
	var recipe = this.recipe;

	$('#recipe-title').text(recipe.title);
	$('#recipe-level').text(recipe.level);
	$('#recipe-time').text(recipe.time);
	$('#recipe-kind').text(recipe.kind);
	$('#recipe-feature').text(recipe.feature);

	this.loadMainPicture(recipe.images);
	this.buildIngredients(recipe.ingredients);
	this.buildPreperations(recipe.preperation);
	this.setFeedbackVisiblity();
};

RecipeController.prototype.loadMainPicture = function(images) {
	var imgPath = 'img/recipes/',
		imgDom = $('.recipe-image');

	if(images.length === 0)
		imgPath += 'default.jpg';
	else
		imgPath += images[0];

	imgDom.html('<img src="' + imgPath + '"" class="preview-img" />');
};

RecipeController.prototype.buildIngredients = function(ingredients) {
	$('.recipe-ingredients table > tbody').remove(); // clear ingredients table

	var ingrTable = '';
	ingredients.forEach(function (ingred, index) {
		var splitIngr = ingred.split('|');
		ingrTable += '<tr><td>' + splitIngr[0] + '</td><td>' + splitIngr[1] + '</td></tr>';
	});

	$('.recipe-ingredients table').append(ingrTable);
};

RecipeController.prototype.buildPreperations = function(preperation) {
	var instruction = '';

	preperation.forEach(function (step, index) {
		instruction += '<h4>' + (index + 1) + '. Schritt:</h4>' + step + '<br />';
	});

	$('.recipe-preperation').append(instruction);
};

RecipeController.prototype.setFeedbackVisiblity = function() {
	var overlayer = $('.feedback > .wrapper > .overlayer');

	if(this.user.isLoggedIn())
		overlayer.hide();
	else
		overlayer.show();
};