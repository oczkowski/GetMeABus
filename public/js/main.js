function toggleLoader(state) { //Loading animation
    state ? $('#locationLoader').fadeIn(100) : $('#locationLoader').fadeOut(300);
};