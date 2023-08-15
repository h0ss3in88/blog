import background from './assets/home-bg.jpg';
function Header() {
    return (<>
        <header className='masthead' style={{backgroundImage : `url(${background})` }}>
            <div className='container position-relative px-4 px-lg-5'>
                <div className='row gx-4 gx-lg-5 justify-content-center'>
                    <div className='col-md-10 col-lg-8 col-xl-7'>
                        <div className='site-heading'>
                            <h1>Blog</h1>
                            <span className='subheading'>A Blog Application that build by REACT</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </>)
}
export default Header;