const IdleTimer =()=>{
    var timeout
    document.getElementById('root').addEventListener('mousemove', function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if (window.location.pathname === '/home') {
                //setOpen({ ...open, 'SessionExpiry': true })
                // var timeleft = 10;
                // downloadTimer = setInterval(function () {
                //     if (timeleft <= 0) {
                //         clearInterval(downloadTimer);
                //         if (!open.SessionExpiry) {
                //             navigate('/');
                //         }
                //     } else {
                //         setSeconds(timeleft);
                //     }
                //     timeleft -= 1;
                // }, 1000);
                //alert('Your session has been expired !!!')
            }
        }, 1000 * 10 * 2);
        // restart the timeout
    });
    return(
        <>
        
        </>
    )
}
export default IdleTimer