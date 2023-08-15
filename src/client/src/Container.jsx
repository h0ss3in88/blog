function Container({childComponent}){
    return (
        <>
            <div className='container px-4 px-lg-5'>
                <div className='row gx-4 gx-lg-5 justify-content-center'>
                    <div className='col-md-10 col-lg-8 col-xl-7'>
                        {childComponent}
                    </div>    
                </div>
            </div>
        </>
    );
}

export default Container