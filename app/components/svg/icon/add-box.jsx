function AddBox({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      className={className}
    >
      <title />

      <g id="Complete">
        <g id="add-square">
          <g>
            <rect
              data-name="--Rectangle"
              fill="none"
              height="20"
              id="_--Rectangle"
              rx="2"
              ry="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              width="20"
              x="2"
              y="2"
            />

            <line
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="15.5"
              x2="8.5"
              y1="12"
              y2="12"
            />

            <line
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="12"
              x2="12"
              y1="15.5"
              y2="8.5"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default AddBox;
