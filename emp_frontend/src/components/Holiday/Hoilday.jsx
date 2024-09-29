import React, { useState, useEffect } from "react";
import Holidays from "date-holidays";

const Holiday = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [country, setCountry] = useState("US");
  const hd = new Holidays();

  useEffect(() => {
    hd.init(country);
    const fetchedHolidays = hd.getHolidays(selectedYear);
    setHolidays(fetchedHolidays);
  }, [selectedYear, country]);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const years = Array.from({ length: 2100 - 1900 + 1 }, (v, i) => i + 1900);

  return (
    <div className="min-h-screen roboto-regular flex flex-col p-6">
      <div className="w-full max-w-6xl rounded-lg p-6 mx-auto flex flex-col">
        <div className="flex flex-col sm:flex-row items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <label
              htmlFor="year"
              className="mr-4 text-lg font-medium text-primary_color"
            >
              Select Year:
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-light_primary px-4 py-2 rounded-lg text-primary_color focus:outline-none focus:ring-2 focus:ring-light_primary"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <label
              htmlFor="country"
              className="ml-0 sm:ml-6 mr-4 text-lg font-medium text-primary_color"
            >
              Select Country:
            </label>
            <select
              id="country"
              value={country}
              onChange={handleCountryChange}
              className="border border-light_primary px-4 py-2 rounded-lg text-primary_color focus:outline-none focus:ring-2 focus:ring-light_primary"
            >
              <option value="US">United States</option>
              <option value="IN">India</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-primary_color mb-6">
          Holidays in {selectedYear} ({country})
        </h2>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-light_primary mb-10">
            <thead>
              <tr className="bg-primary_color">
                <th className="px-6 py-3 border text-left text-white">Date</th>
                <th className="px-6 py-3 border text-left text-white">
                  Holiday
                </th>
              </tr>
            </thead>
            <tbody>
              {holidays.length > 0 ? (
                holidays.map((holiday, index) => (
                  <tr key={index} className="hover:bg-elight_primary">
                    <td className="px-6 py-4 border border-light_primary text-para">
                      {holiday.date}
                    </td>
                    <td className="px-6 py-4 border border-light_primary text-para">
                      {holiday.name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-4 border border-light_primary text-center text-para"
                  >
                    No holidays available for {selectedYear} in {country}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Holiday;
