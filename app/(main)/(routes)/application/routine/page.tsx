import React from 'react';

const RoutinePage: React.FC = () =>
{
  const pdfUrl = '/routine.pdf';

  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Routine</h1>
      <div className="flex-grow">
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title="Routine PDF"
        >
          <p>Your browser doesn't support iframes. You can <a href={pdfUrl}>download the PDF</a> instead.</p>
        </iframe>
      </div>
    </div>
  );
};

export default RoutinePage;
