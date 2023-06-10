import background from "../Image/background.png";
import "../CSS/body.css"
function Body() {
    return (
        <>
            <div className="main-body">
                <div className="background-body">
                    <div className="title-background-body">
                        <div className="title-background-body-1"></div>
                        <div className="title-background-body-1"></div>
                    </div>
                    <div className="div-image-background-body">
                        <img className="image-background-body"
                             src={background}
                             alt={background}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Body;