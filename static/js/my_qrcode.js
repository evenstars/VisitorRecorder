var qrcodeList = new Vue({
    el: '#container',
    data: {
        peopleId: 0,
        photos: []
    },
    created: function() {
        var parameters = Request.parseQueryString(window.location.search);
        this.peopleId = Number(parameters.people);
        this.resetPhotos();
    },
    methods: {
        resetPhotos: function() {
            var self = this;
            // if ( !this.isInWechat() ) {
            //     // location.href = '/home/historyPhotoFile/' + this.peopleId;
            //     location.href = '/home/historyPhoto/' + this.peopleId;
            //     return;
            // }
            $('.tip').show();
            var path = '/home/historyPhoto/' + this.peopleId;
            getJSON(path, function(result) {
                if ( !result.successful ) {
                    return;
                }

                self.photos = result.data.photos;
            });
        },
        isInWechat: function() {
            if ( /micromessenger/.test(navigator.userAgent.toLowerCase()) ) {
                return true;
            }

            return false;
        }
    }
});
