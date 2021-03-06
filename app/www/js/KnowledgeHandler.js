var KnowledgeHandler = function (container, pageId) {
	this.TAG = 'KnowledgeHandler => ';
	this.keywordFile = 'ingredients_complete.json';
	this.keywords = '';
	this.container = container;

	this.loadPage(pageId);
};

KnowledgeHandler.prototype.loadPage = function(id) {
	var self = this;

	$(this.container).load('content/knowledgedb-' + id + '.html', function () {
		$('.knowledge-body').enhanceWithin();
        $('.knowledge-article-chapter > .knowledge-content').hide();

        self.setClickHandler();
		self.setPopupHandler();
    });
};

KnowledgeHandler.prototype.setClickHandler = function() {
	var self = this;

	$(this.container).find('.btn-toggle:visible').on('click', function (event) {
		event.preventDefault();
		$('.knowledge-article-chapter > .knowledge-content').eq(event.target.name -1).toggle();
	});
};

KnowledgeHandler.prototype.loadKeywordList = function(callback) {
	$.getJSON('content/' + this.keywordFile, function (keywords) {
		if(typeof(callback) === 'function' && callback !== undefined)
			callback('keywords-received', keywords);
	});
};

KnowledgeHandler.prototype.setPopupHandler = function(){
	var self = this;

	this.loadKeywordList(function (event, result) {
		self.keywords = result;
		self.managePopups();
	});
};

KnowledgeHandler.prototype.managePopups = function(){
	var self = this;

	$(this.container).find('.knowledgetopics-ingredients a').click(function (event, data){
		$.mobile.loading('show');
		$('.ingredient-list-wrapper').fadeOut('slow', function () {
			$('.ingredient-detail-wrapper').fadeIn('slow');
		});

		var ingredientName = self.getIngredientName(event),
			ingredient = $.grep(self.keywords, function (item) { return item.name === ingredientName }),
			ingredientContr = new KnowledgeIngredientController(ingredient[0]);

		ingredientContr.parse(function (event) {
			$.mobile.loading('hide');

			$('#ingredient-list-btn').on('click', function (event, data) {
				event.preventDefault();
				$('.ingredient-detail-wrapper').fadeOut('slow', function () {
					$('.ingredient-list-wrapper').fadeIn('slow');
				});
			});
		});
	});
};

KnowledgeHandler.prototype.getIngredientName = function(eventData) {
	if(eventData.target.nodeName === 'IMG')
		return eventData.target.parentNode.textContent;

	return eventData.target.textContent;
};