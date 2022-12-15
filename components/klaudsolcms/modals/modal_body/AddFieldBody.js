import Button from "react-bootstrap/Button";

const AddFieldBody = () => {
  return (
    <>
      <div>
        <h6 className="mx-3 my-4"> Select a field for your collection type</h6>
        <div className="block_bar"></div>
        <div className="row">
          <div className="col">
            <div className="mt-4">
              <Button variant="outline-primary" style={{ width: 120 + "px" }}>
                Click Me
              </Button>
            </div>
            <div className="mt-4">
              <Button variant="outline-info" style={{ width: 120 + "px" }}>
                Click Me
              </Button>
            </div>
          </div>
          <div className="col">
            <div className="mt-4">
              <Button variant="outline-success" style={{ width: 120 + "px" }}>
                Click Me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFieldBody;
