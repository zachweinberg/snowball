import React from 'react';

const Axis = ({ points }) => (
  <polyline fill="none" stroke="yellow" strokeWidth=".8" points={points} />
);

interface Props {
  width: number;
  height: number;
  data: Array<{ label: string; value: number }>;
  precision: number;
  horizontalGuides: number;
}

const LineChart: React.FunctionComponent<Props> = ({
  width,
  height,
  data,
  precision,
  horizontalGuides: numberOfHorizontalGuides,
}: Props) => {
  const FONT_SIZE = width / 50;
  const maximumX = data.length - 1;
  const maximumY = Math.max(...data.map((el) => el.value));

  const HorizontalGuides = () => {
    const lines = new Array(numberOfHorizontalGuides).fill(0);

    return (
      <>
        {lines.map((_, index) => {
          const ratio = (index + 1) / numberOfHorizontalGuides;
          const yCoordinate = height - height * ratio;

          return (
            <React.Fragment key={index}>
              <polyline
                fill="none"
                stroke="#4F4F4F"
                strokeWidth="1.2"
                strokeDasharray="10"
                points={`0,${yCoordinate} ${width},${yCoordinate}`}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const LabelsXAxis = () => {
    return (
      <>
        {data.map((el, index) => {
          const x = (index / maximumX) * width;
          return (
            <text
              key={index}
              x={x}
              y={height}
              style={{
                fill: '#4F4F4F',
                fontSize: FONT_SIZE,
                fontFamily: 'Helvetica',
              }}
            >
              {el.label}
            </text>
          );
        })}
      </>
    );
  };

  const makePathPoints = () => {
    const multiplierX = width / data.length - 1;
    const multiplierY = height / Math.max(...data.map((el) => el.value));

    let path = `M 0 ${data[0].value & multiplierY} `;

    data.forEach((el, i) => {
      if (i > 0) {
        const controlPoint = `${300} ${150}`;
        const endPoint = `${i * multiplierX} ${el.value * multiplierY}`;
        path += `L ${endPoint} `;
      }
    });
    console.log(path);
    return path;
  };

  return (
    <svg
      width={width}
      height={height}
      preserveAspectRatio="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* <LabelsXAxis /> */}
      <HorizontalGuides />
      <path d={makePathPoints()} stroke="#CEF33C" strokeWidth="2" fill="none" />
    </svg>
  );
};

export default LineChart;
