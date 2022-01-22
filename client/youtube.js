YoutubePlayer = {
    isApiLoaded: false,
    loadedCallbacks: [],
    onApiLoaded: (callback) => {
        if(YoutubePlayer.isApiLoaded){
            callback()
            return
        }
        loadedCallbacks.push(callback)
    },
    createApi: function(iframeId) {
        let player;
        if(YoutubePlayer.isApiLoaded){
            player = newPlayer()
        } else {
            onApiLoaded(function(){
                player = newPlayer()
            })
        }

        let readyCallbacks = []
        let isPlayerReady = false
        return {
            isReady: () => YoutubePlayer.isApiLoaded && isPlayerReady,
            onReady: (callback) => {
                readyCallbacks.push(callback)
            },
            seekTo: function(seconds){
                player.seekTo(seconds, true)
            }
        };

        function newPlayer(){
            return new YT.Player(iframeId, {
                events: {
                    'onReady': function(event){
                        isPlayerReady=true
                        readyCallbacks.foreach(function(callback){
                            callback()
                        })
                    }
                }
            });
        }
    }
}

window.onYouTubePlayerAPIReady = () => {
    YoutubePlayer.isApiLoaded = true
    YoutubePlayer.loadedCallbacks.forEach(function(callback) {
        callback()
    })
}

$.getScript("https://www.youtube.com/player_api")



