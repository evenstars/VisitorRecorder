module.exports = function createWebSocketPlugin(socket) {
  return store => {
    socket.onmessage = function (message) {
      console.log(message);
      var json_message = JSON.parse(message.data);
      if (json_message.type == 'timeline' && json_message.successful == true) {
        store.dispatch('visitor.fetch', json_message);
        //store.dispatch('gallery.fetch');
        store.commit('earth.ready', true);
        store.dispatch('earth.fetch');
        console.log(store.state.earth.ready);
      }
    }
  }
}