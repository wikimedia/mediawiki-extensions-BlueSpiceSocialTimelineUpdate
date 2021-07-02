bs.social.EntityListMenu.Button.Update = function ( EntityListMenu ) {
	bs.social.EntityListMenu.Button.call( this, EntityListMenu );
	OO.EventEmitter.call( this );
	var me = this;
	me.date = new Date();
};

OO.initClass( bs.social.EntityListMenu.Button.Update );
OO.inheritClass( bs.social.EntityListMenu.Button.Update, bs.social.EntityListMenu.Button );

bs.social.EntityListMenu.Button.Update.prototype.init = function () {
	bs.social.EntityListMenu.Button.Update.super.prototype.init.apply( this );

	var me = this;
	var data = me.makeData();
	BSPing.registerListener(
		'BlueSpiceSocial.TimelineUpdate.Button.Update',
		1000,
		{ 'data': me.EntityListMenu.entityList.makeTaskData( data ) },
		this.PingListener()
	);
};

bs.social.EntityListMenu.Button.Update.prototype.onClick = function () {
	this.date = new Date();
	var dateFilter = this.EntityListMenu.filters[ 'timestampcreated' ];
	if( dateFilter ) {
		dateFilter.field.setValue( this.date );
	}

	var data = this.makeData();
	var indicator = '.bs-social-entitylist-menu-item.bs-entitylist-menu-item-update '
			+ '.bs-social-entitylist-menu-item-actions-btn .updateCounter';
	$( indicator ).html( '' );

	this.EntityListMenu.entityList.getEntities( 'replace', data );
};

bs.social.EntityListMenu.Button.Update.prototype.getTemplate = function() {
	return mw.template.get(
		'ext.bluespice.social.timelineupdate.templates',
		this.getTemplateName()
	);
};

bs.social.EntityListMenu.Button.Update.prototype.getTemplateName = function () {
	return 'BlueSpiceSocialTimelineUpdate.UpdateButton.mustache';
};

bs.social.EntityListMenu.Button.Update.prototype.getTemplateVars = function () {
	return {
		classes: 'bs-entitylist-menu-item-update',
		tooltip: mw.message( 'bs-socialtimelineupdate-update-button-tooltip' ).plain()
	};
};

bs.social.EntityListMenu.Button.Update.prototype.PingListener = function () {
	var me = this;

	return function( result ) {
		var indicator = '.bs-social-entitylist-menu-item.bs-entitylist-menu-item-update '
			+ '.bs-social-entitylist-menu-item-actions-btn .updateCounter';
		if( result.success === true && result.updates !== 0 ) {
			$( indicator ).html( result.updates );
		} else {
			$( indicator ).html( '' );
		}

		var data = me.makeData();
		BSPing.registerListener(
			'BlueSpiceSocial.TimelineUpdate.Button.Update',
			1000,
			{ 'data': me.EntityListMenu.entityList.makeTaskData( data ) },
			me.PingListener()
		);
	};
};

bs.social.EntityListMenu.Button.Update.prototype.makeData = function () {
	var me = this;
	var data = me.EntityListMenu.getData();
	for( var i = 0; i < data.filter.length; i++ ) {
		if( !data.filter[i].property || data.filter[i].property !== 'timestampcreated' ) {
			continue;
		}
		data.filter[i].value = bs.util.convertDateToMWTimestamp( me.date );
		break;
	}
	return data;
};