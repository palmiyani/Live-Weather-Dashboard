import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Loader2, MapPin, Star, X } from 'lucide-react';


const SearchBar = ({
  onSearch,
  onCurrentLocation,
  loading = false,
  locationLoading = false,
  placeholder,
}) => {

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Use placeholder or default
  const searchPlaceholder = placeholder || 'Search for a city...';

  // Sample location data with taluka, district and state information
  const locationDatabase = [
    // Gujarat - Ahmedabad District
    { name: 'Ahmedabad', taluka: 'Ahmedabad City', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Ahmedabad City, Ahmedabad, Gujarat, India' },
    { name: 'Naroda', taluka: 'Ahmedabad City', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Naroda, Ahmedabad City, Ahmedabad, Gujarat, India' },
    { name: 'Vastral', taluka: 'Ahmedabad City', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Vastral, Ahmedabad City, Ahmedabad, Gujarat, India' },
    { name: 'Bapunagar', taluka: 'Ahmedabad City', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Bapunagar, Ahmedabad City, Ahmedabad, Gujarat, India' },
    { name: 'Gomtipur', taluka: 'Ahmedabad City', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Gomtipur, Ahmedabad City, Ahmedabad, Gujarat, India' },
    { name: 'Odhav', taluka: 'Ahmedabad City', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Odhav, Ahmedabad City, Ahmedabad, Gujarat, India' },
    { name: 'Isanpur', taluka: 'Ahmedabad City', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Isanpur, Ahmedabad City, Ahmedabad, Gujarat, India' },
    { name: 'Vejalpur', taluka: 'Ahmedabad City', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Vejalpur, Ahmedabad City, Ahmedabad, Gujarat, India' },
    { name: 'Sarkhej', taluka: 'Sarkhej', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Sarkhej, Sarkhej, Ahmedabad, Gujarat, India' },
    { name: 'Sanand', taluka: 'Sanand', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Sanand, Sanand, Ahmedabad, Gujarat, India' },
    { name: 'Dholka', taluka: 'Dholka', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Dholka, Dholka, Ahmedabad, Gujarat, India' },
    { name: 'Viramgam', taluka: 'Viramgam', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Viramgam, Viramgam, Ahmedabad, Gujarat, India' },
    { name: 'Bavla', taluka: 'Bavla', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Bavla, Bavla, Ahmedabad, Gujarat, India' },
    { name: 'Detroj', taluka: 'Detroj', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Detroj, Detroj, Ahmedabad, Gujarat, India' },
    { name: 'Ranpur', taluka: 'Ranpur', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Ranpur, Ranpur, Ahmedabad, Gujarat, India' },
    { name: 'Barwala', taluka: 'Barwala', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Barwala, Barwala, Ahmedabad, Gujarat, India' },
    { name: 'Mandal', taluka: 'Mandal', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Mandal, Mandal, Ahmedabad, Gujarat, India' },
    { name: 'Dhandhuka', taluka: 'Dhandhuka', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Dhandhuka, Dhandhuka, Ahmedabad, Gujarat, India' },
    { name: 'Limbdi', taluka: 'Limbdi', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Limbdi, Limbdi, Ahmedabad, Gujarat, India' },
    { name: 'Chotila', taluka: 'Chotila', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Chotila, Chotila, Ahmedabad, Gujarat, India' },
    { name: 'Wadhwan', taluka: 'Wadhwan', district: 'Ahmedabad', state: 'Gujarat', country: 'India', fullName: 'Wadhwan, Wadhwan, Ahmedabad, Gujarat, India' },
    { name: 'Surendranagar', taluka: 'Surendranagar', district: 'Surendranagar', state: 'Gujarat', country: 'India', fullName: 'Surendranagar, Surendranagar, Surendranagar, Gujarat, India' },
    { name: 'Dhrangadhra', taluka: 'Dhrangadhra', district: 'Surendranagar', state: 'Gujarat', country: 'India', fullName: 'Dhrangadhra, Dhrangadhra, Surendranagar, Gujarat, India' },
    { name: 'Halvad', taluka: 'Halvad', district: 'Surendranagar', state: 'Gujarat', country: 'India', fullName: 'Halvad, Halvad, Surendranagar, Gujarat, India' },
    { name: 'Lakhtar', taluka: 'Lakhtar', district: 'Surendranagar', state: 'Gujarat', country: 'India', fullName: 'Lakhtar, Lakhtar, Surendranagar, Gujarat, India' },
    { name: 'Muli', taluka: 'Muli', district: 'Surendranagar', state: 'Gujarat', country: 'India', fullName: 'Muli, Muli, Surendranagar, Gujarat, India' },
    { name: 'Thangadh', taluka: 'Thangadh', district: 'Surendranagar', state: 'Gujarat', country: 'India', fullName: 'Thangadh, Thangadh, Surendranagar, Gujarat, India' },
    { name: 'Sayla', taluka: 'Sayla', district: 'Surendranagar', state: 'Gujarat', country: 'India', fullName: 'Sayla, Sayla, Surendranagar, Gujarat, India' },
    { name: 'Chuda', taluka: 'Chuda', district: 'Surendranagar', state: 'Gujarat', country: 'India', fullName: 'Chuda, Chuda, Surendranagar, Gujarat, India' },
    { name: 'Vadodara', taluka: 'Vadodara City', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Vadodara City, Vadodara, Vadodara, Gujarat, India' },
    { name: 'Karjan', taluka: 'Karjan', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Karjan, Karjan, Vadodara, Gujarat, India' },
    { name: 'Padra', taluka: 'Padra', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Padra, Padra, Vadodara, Gujarat, India' },
    { name: 'Dabhoi', taluka: 'Dabhoi', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Dabhoi, Dabhoi, Vadodara, Gujarat, India' },
    { name: 'Savli', taluka: 'Savli', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Savli, Savli, Vadodara, Gujarat, India' },
    { name: 'Sinor', taluka: 'Sinor', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Sinor, Sinor, Vadodara, Gujarat, India' },
    { name: 'Vaghodia', taluka: 'Vaghodia', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Vaghodia, Vaghodia, Vadodara, Gujarat, India' },
    { name: 'Jetpur Pavi', taluka: 'Jetpur Pavi', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Jetpur Pavi, Jetpur Pavi, Vadodara, Gujarat, India' },
    { name: 'Chhota Udaipur', taluka: 'Chhota Udaipur', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Chhota Udaipur, Chhota Udaipur, Vadodara, Gujarat, India' },
    { name: 'Kawant', taluka: 'Kawant', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Kawant, Kawant, Vadodara, Gujarat, India' },
    { name: 'Nasvadi', taluka: 'Nasvadi', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Nasvadi, Nasvadi, Vadodara, Gujarat, India' },
    { name: 'Tilakwada', taluka: 'Tilakwada', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Tilakwada, Tilakwada, Vadodara, Gujarat, India' },
    { name: 'Rajpipla', taluka: 'Rajpipla', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Rajpipla, Rajpipla, Vadodara, Gujarat, India' },
    { name: 'Nandod', taluka: 'Nandod', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Nandod, Nandod, Vadodara, Gujarat, India' },
    { name: 'Dediapada', taluka: 'Dediapada', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Dediapada, Dediapada, Vadodara, Gujarat, India' },
    { name: 'Sagbara', taluka: 'Sagbara', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Sagbara, Sagbara, Vadodara, Gujarat, India' },
    { name: 'Valia', taluka: 'Valia', district: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Valia, Valia, Vadodara, Gujarat, India' },
    { name: 'Ankleshwar', taluka: 'Ankleshwar', district: 'Bharuch', state: 'Gujarat', country: 'India', fullName: 'Ankleshwar, Ankleshwar, Bharuch, Gujarat, India' },
    { name: 'Bharuch', taluka: 'Bharuch', district: 'Bharuch', state: 'Gujarat', country: 'India', fullName: 'Bharuch, Bharuch, Bharuch, Gujarat, India' },
    { name: 'Jambusar', taluka: 'Jambusar', district: 'Bharuch', state: 'Gujarat', country: 'India', fullName: 'Jambusar, Jambusar, Bharuch, Gujarat, India' },
    { name: 'Amod', taluka: 'Amod', district: 'Bharuch', state: 'Gujarat', country: 'India', fullName: 'Amod, Amod, Bharuch, Gujarat, India' },
    { name: 'Vagra', taluka: 'Vagra', district: 'Bharuch', state: 'Gujarat', country: 'India', fullName: 'Vagra, Vagra, Bharuch, Gujarat, India' },
    { name: 'Jhagadia', taluka: 'Jhagadia', district: 'Bharuch', state: 'Gujarat', country: 'India', fullName: 'Jhagadia, Jhagadia, Bharuch, Gujarat, India' },
    { name: 'Hansot', taluka: 'Hansot', district: 'Bharuch', state: 'Gujarat', country: 'India', fullName: 'Hansot, Hansot, Bharuch, Gujarat, India' },
    { name: 'Valia', taluka: 'Valia', district: 'Bharuch', state: 'Gujarat', country: 'India', fullName: 'Valia, Valia, Bharuch, Gujarat, India' },
    { name: 'Surat', taluka: 'Surat City', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Surat City, Surat, Surat, Gujarat, India' },
    { name: 'Olpad', taluka: 'Olpad', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Olpad, Olpad, Surat, Gujarat, India' },
    { name: 'Mangrol', taluka: 'Mangrol', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Mangrol, Mangrol, Surat, Gujarat, India' },
    { name: 'Bardoli', taluka: 'Bardoli', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Bardoli, Bardoli, Surat, Gujarat, India' },
    { name: 'Palsana', taluka: 'Palsana', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Palsana, Palsana, Surat, Gujarat, India' },
    { name: 'Kamrej', taluka: 'Kamrej', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Kamrej, Kamrej, Surat, Gujarat, India' },
    { name: 'Choryasi', taluka: 'Choryasi', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Choryasi, Choryasi, Surat, Gujarat, India' },
    { name: 'Valod', taluka: 'Valod', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Valod, Valod, Surat, Gujarat, India' },
    { name: 'Umarpada', taluka: 'Umarpada', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Umarpada, Umarpada, Surat, Gujarat, India' },
    { name: 'Mahuva', taluka: 'Mahuva', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Mahuva, Mahuva, Surat, Gujarat, India' },
    { name: 'Mandvi', taluka: 'Mandvi', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Mandvi, Mandvi, Surat, Gujarat, India' },
    { name: 'Tapi', taluka: 'Tapi', district: 'Surat', state: 'Gujarat', country: 'India', fullName: 'Tapi, Tapi, Surat, Gujarat, India' },
    { name: 'Vyara', taluka: 'Vyara', district: 'Tapi', state: 'Gujarat', country: 'India', fullName: 'Vyara, Vyara, Tapi, Gujarat, India' },
    { name: 'Songadh', taluka: 'Songadh', district: 'Tapi', state: 'Gujarat', country: 'India', fullName: 'Songadh, Songadh, Tapi, Gujarat, India' },
    { name: 'Uchchhal', taluka: 'Uchchhal', district: 'Tapi', state: 'Gujarat', country: 'India', fullName: 'Uchchhal, Uchchhal, Tapi, Gujarat, India' },
    { name: 'Nizar', taluka: 'Nizar', district: 'Tapi', state: 'Gujarat', country: 'India', fullName: 'Nizar, Nizar, Tapi, Gujarat, India' },
    { name: 'Valod', taluka: 'Valod', district: 'Tapi', state: 'Gujarat', country: 'India', fullName: 'Valod, Valod, Tapi, Gujarat, India' },
    { name: 'Dolvan', taluka: 'Dolvan', district: 'Tapi', state: 'Gujarat', country: 'India', fullName: 'Dolvan, Dolvan, Tapi, Gujarat, India' },
    { name: 'Kukarmunda', taluka: 'Kukarmunda', district: 'Tapi', state: 'Gujarat', country: 'India', fullName: 'Kukarmunda, Kukarmunda, Tapi, Gujarat, India' },
    { name: 'Rajkot', taluka: 'Rajkot City', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Rajkot City, Rajkot, Rajkot, Gujarat, India' },
    { name: 'Gondal', taluka: 'Gondal', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Gondal, Gondal, Rajkot, Gujarat, India' },
    { name: 'Jasdan', taluka: 'Jasdan', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Jasdan, Jasdan, Rajkot, Gujarat, India' },
    { name: 'Jamkandorna', taluka: 'Jamkandorna', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Jamkandorna, Jamkandorna, Rajkot, Gujarat, India' },
    { name: 'Paddhari', taluka: 'Paddhari', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Paddhari, Paddhari, Rajkot, Gujarat, India' },
    { name: 'Kotda Sangani', taluka: 'Kotda Sangani', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Kotda Sangani, Kotda Sangani, Rajkot, Gujarat, India' },
    { name: 'Upleta', taluka: 'Upleta', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Upleta, Upleta, Rajkot, Gujarat, India' },
    { name: 'Dhoraji', taluka: 'Dhoraji', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Dhoraji, Dhoraji, Rajkot, Gujarat, India' },
    { name: 'Jetpur', taluka: 'Jetpur', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Jetpur, Jetpur, Rajkot, Gujarat, India' },
    { name: 'Lodhika', taluka: 'Lodhika', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Lodhika, Lodhika, Rajkot, Gujarat, India' },
    { name: 'Maliya', taluka: 'Maliya', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Maliya, Maliya, Rajkot, Gujarat, India' },
    { name: 'Wankaner', taluka: 'Wankaner', district: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Wankaner, Wankaner, Rajkot, Gujarat, India' },
    { name: 'Morbi', taluka: 'Morbi', district: 'Morbi', state: 'Gujarat', country: 'India', fullName: 'Morbi, Morbi, Morbi, Gujarat, India' },
    { name: 'Tankara', taluka: 'Tankara', district: 'Morbi', state: 'Gujarat', country: 'India', fullName: 'Tankara, Tankara, Morbi, Gujarat, India' },
    { name: 'Wankaner', taluka: 'Wankaner', district: 'Morbi', state: 'Gujarat', country: 'India', fullName: 'Wankaner, Wankaner, Morbi, Gujarat, India' },
    { name: 'Halvad', taluka: 'Halvad', district: 'Morbi', state: 'Gujarat', country: 'India', fullName: 'Halvad, Halvad, Morbi, Gujarat, India' },
    { name: 'Dhrangadhra', taluka: 'Dhrangadhra', district: 'Morbi', state: 'Gujarat', country: 'India', fullName: 'Dhrangadhra, Dhrangadhra, Morbi, Gujarat, India' },
    { name: 'Maliya', taluka: 'Maliya', district: 'Morbi', state: 'Gujarat', country: 'India', fullName: 'Maliya, Maliya, Morbi, Gujarat, India' },
    { name: 'Bhavnagar', taluka: 'Bhavnagar City', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Bhavnagar City, Bhavnagar, Bhavnagar, Gujarat, India' },
    { name: 'Gariadhar', taluka: 'Gariadhar', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Gariadhar, Gariadhar, Bhavnagar, Gujarat, India' },
    { name: 'Palitana', taluka: 'Palitana', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Palitana, Palitana, Bhavnagar, Gujarat, India' },
    { name: 'Sihor', taluka: 'Sihor', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Sihor, Sihor, Bhavnagar, Gujarat, India' },
    { name: 'Ghogha', taluka: 'Ghogha', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Ghogha, Ghogha, Bhavnagar, Gujarat, India' },
    { name: 'Umrala', taluka: 'Umrala', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Umrala, Umrala, Bhavnagar, Gujarat, India' },
    { name: 'Talaja', taluka: 'Talaja', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Talaja, Talaja, Bhavnagar, Gujarat, India' },
    { name: 'Mahuva', taluka: 'Mahuva', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Mahuva, Mahuva, Bhavnagar, Gujarat, India' },
    { name: 'Gariadhar', taluka: 'Gariadhar', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Gariadhar, Gariadhar, Bhavnagar, Gujarat, India' },
    { name: 'Vallabhipur', taluka: 'Vallabhipur', district: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Vallabhipur, Vallabhipur, Bhavnagar, Gujarat, India' },
    { name: 'Botad', taluka: 'Botad', district: 'Botad', state: 'Gujarat', country: 'India', fullName: 'Botad, Botad, Botad, Gujarat, India' },
    { name: 'Gadhada', taluka: 'Gadhada', district: 'Botad', state: 'Gujarat', country: 'India', fullName: 'Gadhada, Gadhada, Botad, Gujarat, India' },
    { name: 'Vallabhipur', taluka: 'Vallabhipur', district: 'Botad', state: 'Gujarat', country: 'India', fullName: 'Vallabhipur, Vallabhipur, Botad, Gujarat, India' },
    { name: 'Barwala', taluka: 'Barwala', district: 'Botad', state: 'Gujarat', country: 'India', fullName: 'Barwala, Barwala, Botad, Gujarat, India' },
    { name: 'Amreli', taluka: 'Amreli', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Amreli, Amreli, Amreli, Gujarat, India' },
    { name: 'Babra', taluka: 'Babra', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Babra, Babra, Amreli, Gujarat, India' },
    { name: 'Lathi', taluka: 'Lathi', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Lathi, Lathi, Amreli, Gujarat, India' },
    { name: 'Rajula', taluka: 'Rajula', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Rajula, Rajula, Amreli, Gujarat, India' },
    { name: 'Jafrabad', taluka: 'Jafrabad', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Jafrabad, Jafrabad, Amreli, Gujarat, India' },
    { name: 'Khambha', taluka: 'Khambha', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Khambha, Khambha, Amreli, Gujarat, India' },
    { name: 'Savarkundla', taluka: 'Savarkundla', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Savarkundla, Savarkundla, Amreli, Gujarat, India' },
    { name: 'Kodinar', taluka: 'Kodinar', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Kodinar, Kodinar, Amreli, Gujarat, India' },
    { name: 'Dhari', taluka: 'Dhari', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Dhari, Dhari, Amreli, Gujarat, India' },
    { name: 'Bagasara', taluka: 'Bagasara', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Bagasara, Bagasara, Amreli, Gujarat, India' },
    { name: 'Liliya', taluka: 'Liliya', district: 'Amreli', state: 'Gujarat', country: 'India', fullName: 'Liliya, Liliya, Amreli, Gujarat, India' },
    { name: 'Junagadh', taluka: 'Junagadh City', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Junagadh City, Junagadh, Junagadh, Gujarat, India' },
    { name: 'Bhesan', taluka: 'Bhesan', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Bhesan, Bhesan, Junagadh, Gujarat, India' },
    { name: 'Mendarda', taluka: 'Mendarda', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Mendarda, Mendarda, Junagadh, Gujarat, India' },
    { name: 'Vanthali', taluka: 'Vanthali', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Vanthali, Vanthali, Junagadh, Gujarat, India' },
    { name: 'Visavadar', taluka: 'Visavadar', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Visavadar, Visavadar, Junagadh, Gujarat, India' },
    { name: 'Keshod', taluka: 'Keshod', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Keshod, Keshod, Junagadh, Gujarat, India' },
    { name: 'Mangrol', taluka: 'Mangrol', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Mangrol, Mangrol, Junagadh, Gujarat, India' },
    { name: 'Sutrapada', taluka: 'Sutrapada', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Sutrapada, Sutrapada, Junagadh, Gujarat, India' },
    { name: 'Kodinar', taluka: 'Kodinar', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Kodinar, Kodinar, Junagadh, Gujarat, India' },
    { name: 'Talala', taluka: 'Talala', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Talala, Talala, Junagadh, Gujarat, India' },
    { name: 'Patan-Veraval', taluka: 'Patan-Veraval', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Patan-Veraval, Patan-Veraval, Junagadh, Gujarat, India' },
    { name: 'Una', taluka: 'Una', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Una, Una, Junagadh, Gujarat, India' },
    { name: 'Dhoraji', taluka: 'Dhoraji', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Dhoraji, Dhoraji, Junagadh, Gujarat, India' },
    { name: 'Gir Gadhada', taluka: 'Gir Gadhada', district: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Gir Gadhada, Gir Gadhada, Junagadh, Gujarat, India' },
    { name: 'Porbandar', taluka: 'Porbandar', district: 'Porbandar', state: 'Gujarat', country: 'India', fullName: 'Porbandar, Porbandar, Porbandar, Gujarat, India' },
    { name: 'Ranavav', taluka: 'Ranavav', district: 'Porbandar', state: 'Gujarat', country: 'India', fullName: 'Ranavav, Ranavav, Porbandar, Gujarat, India' },
    { name: 'Kutiyana', taluka: 'Kutiyana', district: 'Porbandar', state: 'Gujarat', country: 'India', fullName: 'Kutiyana, Kutiyana, Porbandar, Gujarat, India' },
    { name: 'Jamnagar', taluka: 'Jamnagar City', district: 'Jamnagar', state: 'Gujarat', country: 'India', fullName: 'Jamnagar City, Jamnagar, Jamnagar, Gujarat, India' },
    { name: 'Dhrol', taluka: 'Dhrol', district: 'Jamnagar', state: 'Gujarat', country: 'India', fullName: 'Dhrol, Dhrol, Jamnagar, Gujarat, India' },
    { name: 'Kalavad', taluka: 'Kalavad', district: 'Jamnagar', state: 'Gujarat', country: 'India', fullName: 'Kalavad, Kalavad, Jamnagar, Gujarat, India' },
    { name: 'Lalpur', taluka: 'Lalpur', district: 'Jamnagar', state: 'Gujarat', country: 'India', fullName: 'Lalpur, Lalpur, Jamnagar, Gujarat, India' },
    { name: 'Jodiya', taluka: 'Jodiya', district: 'Jamnagar', state: 'Gujarat', country: 'India', fullName: 'Jodiya, Jodiya, Jamnagar, Gujarat, India' },
    { name: 'Bhanvad', taluka: 'Bhanvad', district: 'Jamnagar', state: 'Gujarat', country: 'India', fullName: 'Bhanvad, Bhanvad, Jamnagar, Gujarat, India' },
    { name: 'Okha', taluka: 'Okha', district: 'Jamnagar', state: 'Gujarat', country: 'India', fullName: 'Okha, Okha, Jamnagar, Gujarat, India' },
    { name: 'Kutch', taluka: 'Kutch', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Kutch, Kutch, Kutch, Gujarat, India' },
    { name: 'Bhuj', taluka: 'Bhuj', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Bhuj, Bhuj, Kutch, Gujarat, India' },
    { name: 'Anjar', taluka: 'Anjar', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Anjar, Anjar, Kutch, Gujarat, India' },
    { name: 'Gandhidham', taluka: 'Gandhidham', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Gandhidham, Gandhidham, Kutch, Gujarat, India' },
    { name: 'Rapar', taluka: 'Rapar', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Rapar, Rapar, Kutch, Gujarat, India' },
    { name: 'Bhachau', taluka: 'Bhachau', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Bhachau, Bhachau, Kutch, Gujarat, India' },
    { name: 'Mundra', taluka: 'Mundra', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Mundra, Mundra, Kutch, Gujarat, India' },
    { name: 'Abdasa', taluka: 'Abdasa', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Abdasa, Abdasa, Kutch, Gujarat, India' },
    { name: 'Lakhpat', taluka: 'Lakhpat', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Lakhpat, Lakhpat, Kutch, Gujarat, India' },
    { name: 'Nakhatrana', taluka: 'Nakhatrana', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Nakhatrana, Nakhatrana, Kutch, Gujarat, India' },
    { name: 'Mandvi', taluka: 'Mandvi', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Mandvi, Mandvi, Kutch, Gujarat, India' },
    { name: 'Gandhidham', taluka: 'Gandhidham', district: 'Kutch', state: 'Gujarat', country: 'India', fullName: 'Gandhidham, Gandhidham, Kutch, Gujarat, India' },
    { name: 'Ahmedabad', state: 'Uttar Pradesh', country: 'India', fullName: 'Ahmedabad, Uttar Pradesh, India' },
    { name: 'Ahmadabad', state: 'Paktia', country: 'Afghanistan', fullName: 'Ahmadabad District, Paktia, Afghanistan' },
    { name: 'Ahmadabad', state: 'Sistan and Baluchestan', country: 'Iran', fullName: 'Ahmadabad, Sistan and Baluchestan, Iran' },
    { name: 'Delhi', state: 'Delhi', country: 'India', fullName: 'Delhi, Delhi, India' },
    { name: 'Mumbai', state: 'Maharashtra', country: 'India', fullName: 'Mumbai, Maharashtra, India' },
    { name: 'Bangalore', state: 'Karnataka', country: 'India', fullName: 'Bangalore, Karnataka, India' },
    { name: 'Chennai', state: 'Tamil Nadu', country: 'India', fullName: 'Chennai, Tamil Nadu, India' },
    { name: 'Kolkata', state: 'West Bengal', country: 'India', fullName: 'Kolkata, West Bengal, India' },
    { name: 'Hyderabad', state: 'Telangana', country: 'India', fullName: 'Hyderabad, Telangana, India' },
    { name: 'Pune', state: 'Maharashtra', country: 'India', fullName: 'Pune, Maharashtra, India' },
    { name: 'Jaipur', state: 'Rajasthan', country: 'India', fullName: 'Jaipur, Rajasthan, India' },
    { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', fullName: 'Lucknow, Uttar Pradesh, India' },
    { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', fullName: 'Kanpur, Uttar Pradesh, India' },
    { name: 'Nagpur', state: 'Maharashtra', country: 'India', fullName: 'Nagpur, Maharashtra, India' },
    { name: 'Indore', state: 'Madhya Pradesh', country: 'India', fullName: 'Indore, Madhya Pradesh, India' },
    { name: 'Thane', state: 'Maharashtra', country: 'India', fullName: 'Thane, Maharashtra, India' },
    { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', fullName: 'Bhopal, Madhya Pradesh, India' },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', fullName: 'Visakhapatnam, Andhra Pradesh, India' },
    { name: 'Pimpri-Chinchwad', state: 'Maharashtra', country: 'India', fullName: 'Pimpri-Chinchwad, Maharashtra, India' },
    { name: 'Patna', state: 'Bihar', country: 'India', fullName: 'Patna, Bihar, India' },
    { name: 'Vadodara', state: 'Gujarat', country: 'India', fullName: 'Vadodara, Gujarat, India' },
    { name: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', fullName: 'Ghaziabad, Uttar Pradesh, India' },
    { name: 'Ludhiana', state: 'Punjab', country: 'India', fullName: 'Ludhiana, Punjab, India' },
    { name: 'Agra', state: 'Uttar Pradesh', country: 'India', fullName: 'Agra, Uttar Pradesh, India' },
    { name: 'Nashik', state: 'Maharashtra', country: 'India', fullName: 'Nashik, Maharashtra, India' },
    { name: 'Faridabad', state: 'Haryana', country: 'India', fullName: 'Faridabad, Haryana, India' },
    { name: 'Meerut', state: 'Uttar Pradesh', country: 'India', fullName: 'Meerut, Uttar Pradesh, India' },
    { name: 'Rajkot', state: 'Gujarat', country: 'India', fullName: 'Rajkot, Gujarat, India' },
    { name: 'Kalyan-Dombivali', state: 'Maharashtra', country: 'India', fullName: 'Kalyan-Dombivali, Maharashtra, India' },
    { name: 'Vasai-Virar', state: 'Maharashtra', country: 'India', fullName: 'Vasai-Virar, Maharashtra, India' },
    { name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', fullName: 'Varanasi, Uttar Pradesh, India' },
    { name: 'Srinagar', state: 'Jammu and Kashmir', country: 'India', fullName: 'Srinagar, Jammu and Kashmir, India' },
    { name: 'Aurangabad', state: 'Maharashtra', country: 'India', fullName: 'Aurangabad, Maharashtra, India' },
    { name: 'Dhanbad', state: 'Jharkhand', country: 'India', fullName: 'Dhanbad, Jharkhand, India' },
    { name: 'Amritsar', state: 'Punjab', country: 'India', fullName: 'Amritsar, Punjab, India' },
    { name: 'Allahabad', state: 'Uttar Pradesh', country: 'India', fullName: 'Allahabad, Uttar Pradesh, India' },
    { name: 'Ranchi', state: 'Jharkhand', country: 'India', fullName: 'Ranchi, Jharkhand, India' },
    { name: 'Howrah', state: 'West Bengal', country: 'India', fullName: 'Howrah, West Bengal, India' },
    { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', fullName: 'Coimbatore, Tamil Nadu, India' },
    { name: 'Jabalpur', state: 'Madhya Pradesh', country: 'India', fullName: 'Jabalpur, Madhya Pradesh, India' },
    { name: 'Gwalior', state: 'Madhya Pradesh', country: 'India', fullName: 'Gwalior, Madhya Pradesh, India' },
    { name: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', fullName: 'Vijayawada, Andhra Pradesh, India' },
    { name: 'Jodhpur', state: 'Rajasthan', country: 'India', fullName: 'Jodhpur, Rajasthan, India' },
    { name: 'Madurai', state: 'Tamil Nadu', country: 'India', fullName: 'Madurai, Tamil Nadu, India' },
    { name: 'Raipur', state: 'Chhattisgarh', country: 'India', fullName: 'Raipur, Chhattisgarh, India' },
    { name: 'Kota', state: 'Rajasthan', country: 'India', fullName: 'Kota, Rajasthan, India' },
    { name: 'Guwahati', state: 'Assam', country: 'India', fullName: 'Guwahati, Assam, India' },
    { name: 'Chandigarh', state: 'Chandigarh', country: 'India', fullName: 'Chandigarh, Chandigarh, India' },
    { name: 'Solapur', state: 'Maharashtra', country: 'India', fullName: 'Solapur, Maharashtra, India' },
    { name: 'Hubballi-Dharwad', state: 'Karnataka', country: 'India', fullName: 'Hubballi-Dharwad, Karnataka, India' },
    { name: 'Mysore', state: 'Karnataka', country: 'India', fullName: 'Mysore, Karnataka, India' },
    { name: 'Tiruppur', state: 'Tamil Nadu', country: 'India', fullName: 'Tiruppur, Tamil Nadu, India' },
    { name: 'Bareilly', state: 'Uttar Pradesh', country: 'India', fullName: 'Bareilly, Uttar Pradesh, India' },
    { name: 'Aligarh', state: 'Uttar Pradesh', country: 'India', fullName: 'Aligarh, Uttar Pradesh, India' },
    { name: 'Moradabad', state: 'Uttar Pradesh', country: 'India', fullName: 'Moradabad, Uttar Pradesh, India' },
    { name: 'Bhubaneswar', state: 'Odisha', country: 'India', fullName: 'Bhubaneswar, Odisha, India' },
    { name: 'Salem', state: 'Tamil Nadu', country: 'India', fullName: 'Salem, Tamil Nadu, India' },
    { name: 'Warangal', state: 'Telangana', country: 'India', fullName: 'Warangal, Telangana, India' },
    { name: 'Guntur', state: 'Andhra Pradesh', country: 'India', fullName: 'Guntur, Andhra Pradesh, India' },
    { name: 'Bhiwandi', state: 'Maharashtra', country: 'India', fullName: 'Bhiwandi, Maharashtra, India' },
    { name: 'Amravati', state: 'Maharashtra', country: 'India', fullName: 'Amravati, Maharashtra, India' },
    { name: 'Noida', state: 'Uttar Pradesh', country: 'India', fullName: 'Noida, Uttar Pradesh, India' },
    { name: 'Jamshedpur', state: 'Jharkhand', country: 'India', fullName: 'Jamshedpur, Jharkhand, India' },
    { name: 'Bhilai', state: 'Chhattisgarh', country: 'India', fullName: 'Bhilai, Chhattisgarh, India' },
    { name: 'Cuttack', state: 'Odisha', country: 'India', fullName: 'Cuttack, Odisha, India' },
    { name: 'Firozabad', state: 'Uttar Pradesh', country: 'India', fullName: 'Firozabad, Uttar Pradesh, India' },
    { name: 'Kochi', state: 'Kerala', country: 'India', fullName: 'Kochi, Kerala, India' },
    { name: 'Nellore', state: 'Andhra Pradesh', country: 'India', fullName: 'Nellore, Andhra Pradesh, India' },
    { name: 'Bhavnagar', state: 'Gujarat', country: 'India', fullName: 'Bhavnagar, Gujarat, India' },
    { name: 'Dehradun', state: 'Uttarakhand', country: 'India', fullName: 'Dehradun, Uttarakhand, India' },
    { name: 'Durgapur', state: 'West Bengal', country: 'India', fullName: 'Durgapur, West Bengal, India' },
    { name: 'Asansol', state: 'West Bengal', country: 'India', fullName: 'Asansol, West Bengal, India' },
    { name: 'Rourkela', state: 'Odisha', country: 'India', fullName: 'Rourkela, Odisha, India' },
    { name: 'Nanded', state: 'Maharashtra', country: 'India', fullName: 'Nanded, Maharashtra, India' },
    { name: 'Kolhapur', state: 'Maharashtra', country: 'India', fullName: 'Kolhapur, Maharashtra, India' },
    { name: 'Ajmer', state: 'Rajasthan', country: 'India', fullName: 'Ajmer, Rajasthan, India' },
    { name: 'Gulbarga', state: 'Karnataka', country: 'India', fullName: 'Gulbarga, Karnataka, India' },
    { name: 'Loni', state: 'Uttar Pradesh', country: 'India', fullName: 'Loni, Uttar Pradesh, India' },
    { name: 'Ujjain', state: 'Madhya Pradesh', country: 'India', fullName: 'Ujjain, Madhya Pradesh, India' },
    { name: 'Siliguri', state: 'West Bengal', country: 'India', fullName: 'Siliguri, West Bengal, India' },
    { name: 'Jhansi', state: 'Uttar Pradesh', country: 'India', fullName: 'Jhansi, Uttar Pradesh, India' },
    { name: 'Ulhasnagar', state: 'Maharashtra', country: 'India', fullName: 'Ulhasnagar, Maharashtra, India' },
    { name: 'Jammu', state: 'Jammu and Kashmir', country: 'India', fullName: 'Jammu, Jammu and Kashmir, India' },
    { name: 'Sangli-Miraj', state: 'Maharashtra', country: 'India', fullName: 'Sangli-Miraj, Maharashtra, India' },
    { name: 'Mangalore', state: 'Karnataka', country: 'India', fullName: 'Mangalore, Karnataka, India' },
    { name: 'Erode', state: 'Tamil Nadu', country: 'India', fullName: 'Erode, Tamil Nadu, India' },
    { name: 'Belgaum', state: 'Karnataka', country: 'India', fullName: 'Belgaum, Karnataka, India' },
    { name: 'Ambattur', state: 'Tamil Nadu', country: 'India', fullName: 'Ambattur, Tamil Nadu, India' },
    { name: 'Tirunelveli', state: 'Tamil Nadu', country: 'India', fullName: 'Tirunelveli, Tamil Nadu, India' },
    { name: 'Malegaon', state: 'Maharashtra', country: 'India', fullName: 'Malegaon, Maharashtra, India' },
    { name: 'Gaya', state: 'Bihar', country: 'India', fullName: 'Gaya, Bihar, India' },
    { name: 'Jalgaon', state: 'Maharashtra', country: 'India', fullName: 'Jalgaon, Maharashtra, India' },
    { name: 'Udaipur', state: 'Rajasthan', country: 'India', fullName: 'Udaipur, Rajasthan, India' },
    { name: 'Maheshtala', state: 'West Bengal', country: 'India', fullName: 'Maheshtala, West Bengal, India' },
    { name: 'Tirupati', state: 'Andhra Pradesh', country: 'India', fullName: 'Tirupati, Andhra Pradesh, India' },
    { name: 'Davanagere', state: 'Karnataka', country: 'India', fullName: 'Davanagere, Karnataka, India' },
    { name: 'Kozhikode', state: 'Kerala', country: 'India', fullName: 'Kozhikode, Kerala, India' },
    { name: 'Akola', state: 'Maharashtra', country: 'India', fullName: 'Akola, Maharashtra, India' },
    { name: 'Kurnool', state: 'Andhra Pradesh', country: 'India', fullName: 'Kurnool, Andhra Pradesh, India' },
    { name: 'Rajpur Sonarpur', state: 'West Bengal', country: 'India', fullName: 'Rajpur Sonarpur, West Bengal, India' },
    { name: 'Bokaro', state: 'Jharkhand', country: 'India', fullName: 'Bokaro, Jharkhand, India' },
    { name: 'South Dumdum', state: 'West Bengal', country: 'India', fullName: 'South Dumdum, West Bengal, India' },
    { name: 'Bellary', state: 'Karnataka', country: 'India', fullName: 'Bellary, Karnataka, India' },
    { name: 'Patiala', state: 'Punjab', country: 'India', fullName: 'Patiala, Punjab, India' },
    { name: 'Gopalpur', state: 'West Bengal', country: 'India', fullName: 'Gopalpur, West Bengal, India' },
    { name: 'Agartala', state: 'Tripura', country: 'India', fullName: 'Agartala, Tripura, India' },
    { name: 'Bhagalpur', state: 'Bihar', country: 'India', fullName: 'Bhagalpur, Bihar, India' },
    { name: 'Muzaffarnagar', state: 'Uttar Pradesh', country: 'India', fullName: 'Muzaffarnagar, Uttar Pradesh, India' },
    { name: 'Bhatpara', state: 'West Bengal', country: 'India', fullName: 'Bhatpara, West Bengal, India' },
    { name: 'Panihati', state: 'West Bengal', country: 'India', fullName: 'Panihati, West Bengal, India' },
    { name: 'Latur', state: 'Maharashtra', country: 'India', fullName: 'Latur, Maharashtra, India' },
    { name: 'Dhule', state: 'Maharashtra', country: 'India', fullName: 'Dhule, Maharashtra, India' },
    { name: 'Rohtak', state: 'Haryana', country: 'India', fullName: 'Rohtak, Haryana, India' },
    { name: 'Korba', state: 'Chhattisgarh', country: 'India', fullName: 'Korba, Chhattisgarh, India' },
    { name: 'Bhilwara', state: 'Rajasthan', country: 'India', fullName: 'Bhilwara, Rajasthan, India' },
    { name: 'Brahmapur', state: 'Odisha', country: 'India', fullName: 'Brahmapur, Odisha, India' },
    { name: 'Muzaffarpur', state: 'Bihar', country: 'India', fullName: 'Muzaffarpur, Bihar, India' },
    { name: 'Ahmednagar', state: 'Maharashtra', country: 'India', fullName: 'Ahmednagar, Maharashtra, India' },
    { name: 'Mathura', state: 'Uttar Pradesh', country: 'India', fullName: 'Mathura, Uttar Pradesh, India' },
    { name: 'Kollam', state: 'Kerala', country: 'India', fullName: 'Kollam, Kerala, India' },
    { name: 'Avadi', state: 'Tamil Nadu', country: 'India', fullName: 'Avadi, Tamil Nadu, India' },
    { name: 'Kadapa', state: 'Andhra Pradesh', country: 'India', fullName: 'Kadapa, Andhra Pradesh, India' },
    { name: 'Kamarhati', state: 'West Bengal', country: 'India', fullName: 'Kamarhati, West Bengal, India' },
    { name: 'Bilaspur', state: 'Chhattisgarh', country: 'India', fullName: 'Bilaspur, Chhattisgarh, India' },
    { name: 'Shahjahanpur', state: 'Uttar Pradesh', country: 'India', fullName: 'Shahjahanpur, Uttar Pradesh, India' },
    { name: 'Satara', state: 'Maharashtra', country: 'India', fullName: 'Satara, Maharashtra, India' },
    { name: 'Bijapur', state: 'Karnataka', country: 'India', fullName: 'Bijapur, Karnataka, India' },
    { name: 'Rampur', state: 'Uttar Pradesh', country: 'India', fullName: 'Rampur, Uttar Pradesh, India' },
    { name: 'Shivamogga', state: 'Karnataka', country: 'India', fullName: 'Shivamogga, Karnataka, India' },
    { name: 'Chandrapur', state: 'Maharashtra', country: 'India', fullName: 'Chandrapur, Maharashtra, India' },
    { name: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Junagadh, Gujarat, India' },
    { name: 'Thrissur', state: 'Kerala', country: 'India', fullName: 'Thrissur, Kerala, India' },
    { name: 'Alwar', state: 'Rajasthan', country: 'India', fullName: 'Alwar, Rajasthan, India' },
    { name: 'Bardhaman', state: 'West Bengal', country: 'India', fullName: 'Bardhaman, West Bengal, India' },
    { name: 'Kulti', state: 'West Bengal', country: 'India', fullName: 'Kulti, West Bengal, India' },
    { name: 'Kakinada', state: 'Andhra Pradesh', country: 'India', fullName: 'Kakinada, Andhra Pradesh, India' },
    { name: 'Nizamabad', state: 'Telangana', country: 'India', fullName: 'Nizamabad, Telangana, India' },
    { name: 'Parbhani', state: 'Maharashtra', country: 'India', fullName: 'Parbhani, Maharashtra, India' },
    { name: 'Tumkur', state: 'Karnataka', country: 'India', fullName: 'Tumkur, Karnataka, India' },
    { name: 'Hisar', state: 'Haryana', country: 'India', fullName: 'Hisar, Haryana, India' },
    { name: 'Firozpur', state: 'Punjab', country: 'India', fullName: 'Firozpur, Punjab, India' },
    { name: 'Bhiwani', state: 'Haryana', country: 'India', fullName: 'Bhiwani, Haryana, India' },
    { name: 'Panipat', state: 'Haryana', country: 'India', fullName: 'Panipat, Haryana, India' },
    { name: 'Darbhanga', state: 'Bihar', country: 'India', fullName: 'Darbhanga, Bihar, India' },
    { name: 'Batala', state: 'Punjab', country: 'India', fullName: 'Batala, Punjab, India' },
    { name: 'Panvel', state: 'Maharashtra', country: 'India', fullName: 'Panvel, Maharashtra, India' },
    { name: 'Bathinda', state: 'Punjab', country: 'India', fullName: 'Bathinda, Punjab, India' },
    { name: 'Latur', state: 'Maharashtra', country: 'India', fullName: 'Latur, Maharashtra, India' },
    { name: 'Dhule', state: 'Maharashtra', country: 'India', fullName: 'Dhule, Maharashtra, India' },
    { name: 'Rohtak', state: 'Haryana', country: 'India', fullName: 'Rohtak, Haryana, India' },
    { name: 'Korba', state: 'Chhattisgarh', country: 'India', fullName: 'Korba, Chhattisgarh, India' },
    { name: 'Bhilwara', state: 'Rajasthan', country: 'India', fullName: 'Bhilwara, Rajasthan, India' },
    { name: 'Brahmapur', state: 'Odisha', country: 'India', fullName: 'Brahmapur, Odisha, India' },
    { name: 'Muzaffarpur', state: 'Bihar', country: 'India', fullName: 'Muzaffarpur, Bihar, India' },
    { name: 'Ahmednagar', state: 'Maharashtra', country: 'India', fullName: 'Ahmednagar, Maharashtra, India' },
    { name: 'Mathura', state: 'Uttar Pradesh', country: 'India', fullName: 'Mathura, Uttar Pradesh, India' },
    { name: 'Kollam', state: 'Kerala', country: 'India', fullName: 'Kollam, Kerala, India' },
    { name: 'Avadi', state: 'Tamil Nadu', country: 'India', fullName: 'Avadi, Tamil Nadu, India' },
    { name: 'Kadapa', state: 'Andhra Pradesh', country: 'India', fullName: 'Kadapa, Andhra Pradesh, India' },
    { name: 'Kamarhati', state: 'West Bengal', country: 'India', fullName: 'Kamarhati, West Bengal, India' },
    { name: 'Bilaspur', state: 'Chhattisgarh', country: 'India', fullName: 'Bilaspur, Chhattisgarh, India' },
    { name: 'Shahjahanpur', state: 'Uttar Pradesh', country: 'India', fullName: 'Shahjahanpur, Uttar Pradesh, India' },
    { name: 'Satara', state: 'Maharashtra', country: 'India', fullName: 'Satara, Maharashtra, India' },
    { name: 'Bijapur', state: 'Karnataka', country: 'India', fullName: 'Bijapur, Karnataka, India' },
    { name: 'Rampur', state: 'Uttar Pradesh', country: 'India', fullName: 'Rampur, Uttar Pradesh, India' },
    { name: 'Shivamogga', state: 'Karnataka', country: 'India', fullName: 'Shivamogga, Karnataka, India' },
    { name: 'Chandrapur', state: 'Maharashtra', country: 'India', fullName: 'Chandrapur, Maharashtra, India' },
    { name: 'Junagadh', state: 'Gujarat', country: 'India', fullName: 'Junagadh, Gujarat, India' },
    { name: 'Thrissur', state: 'Kerala', country: 'India', fullName: 'Thrissur, Kerala, India' },
    { name: 'Alwar', state: 'Rajasthan', country: 'India', fullName: 'Alwar, Rajasthan, India' },
    { name: 'Bardhaman', state: 'West Bengal', country: 'India', fullName: 'Bardhaman, West Bengal, India' },
    { name: 'Kulti', state: 'West Bengal', country: 'India', fullName: 'Kulti, West Bengal, India' },
    { name: 'Kakinada', state: 'Andhra Pradesh', country: 'India', fullName: 'Kakinada, Andhra Pradesh, India' },
    { name: 'Nizamabad', state: 'Telangana', country: 'India', fullName: 'Nizamabad, Telangana, India' },
    { name: 'Parbhani', state: 'Maharashtra', country: 'India', fullName: 'Parbhani, Maharashtra, India' },
    { name: 'Tumkur', state: 'Karnataka', country: 'India', fullName: 'Tumkur, Karnataka, India' },
    { name: 'Hisar', state: 'Haryana', country: 'India', fullName: 'Hisar, Haryana, India' },
    { name: 'Firozpur', state: 'Punjab', country: 'India', fullName: 'Firozpur, Punjab, India' },
    { name: 'Bhiwani', state: 'Haryana', country: 'India', fullName: 'Bhiwani, Haryana, India' },
    { name: 'Panipat', state: 'Haryana', country: 'India', fullName: 'Panipat, Haryana, India' },
    { name: 'Darbhanga', state: 'Bihar', country: 'India', fullName: 'Darbhanga, Bihar, India' },
    { name: 'Batala', state: 'Punjab', country: 'India', fullName: 'Batala, Punjab, India' },
    { name: 'Panvel', state: 'Maharashtra', country: 'India', fullName: 'Panvel, Maharashtra, India' },
    { name: 'Bathinda', state: 'Punjab', country: 'India', fullName: 'Bathinda, Punjab, India' },
    { name: 'Naroda', state: 'Gujarat', country: 'India', fullName: 'Naroda, Gujarat, India' },
    { name: 'Naroda', state: 'Delhi', country: 'India', fullName: 'Naroda, Delhi, India' },
    { name: 'Naroda', state: 'Rajasthan', country: 'India', fullName: 'Naroda, Rajasthan, India' },
    // International cities
    { name: 'New York', state: 'New York', country: 'United States', fullName: 'New York, New York, United States' },
    { name: 'London', state: 'England', country: 'United Kingdom', fullName: 'London, England, United Kingdom' },
    { name: 'Tokyo', state: 'Tokyo', country: 'Japan', fullName: 'Tokyo, Tokyo, Japan' },
    { name: 'Paris', state: 'Île-de-France', country: 'France', fullName: 'Paris, Île-de-France, France' },
    { name: 'Sydney', state: 'New South Wales', country: 'Australia', fullName: 'Sydney, New South Wales, Australia' },
    { name: 'Toronto', state: 'Ontario', country: 'Canada', fullName: 'Toronto, Ontario, Canada' },
    { name: 'Berlin', state: 'Berlin', country: 'Germany', fullName: 'Berlin, Berlin, Germany' },
    { name: 'Moscow', state: 'Moscow', country: 'Russia', fullName: 'Moscow, Moscow, Russia' },
    { name: 'Beijing', state: 'Beijing', country: 'China', fullName: 'Beijing, Beijing, China' },
    { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', fullName: 'Dubai, Dubai, United Arab Emirates' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // For manual searches, try to extract just the city name
      // If the query contains commas, take the first part as the city name
      let cityName = query.trim().split(',')[0].trim();
      
      // Remove common suffixes that might cause API issues
      cityName = cityName.replace(/\s+(City|Town|Village|District|State)$/i, '');
      
      onSearch(cityName);
      setShowSuggestions(false);
    }
  };

  const handleCurrentLocation = () => {
    if (onCurrentLocation) {
      onCurrentLocation();
    }
  };

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Check if dropdown would go below viewport
      const dropdownHeight = Math.min(suggestions.length * 60, 320); // Approximate height
      const wouldGoBelow = rect.bottom + dropdownHeight > viewportHeight;
      
      // Check if dropdown would go off the right edge
      const maxWidth = Math.min(rect.width, 400);
      const wouldGoOffRight = rect.left + maxWidth > viewportWidth;
      
      setDropdownPosition({
        top: wouldGoBelow ? rect.top - dropdownHeight - 5 : rect.bottom + 5,
        left: wouldGoOffRight ? Math.max(0, viewportWidth - maxWidth - 10) : rect.left,
        width: maxWidth
      });
    }
  };

  // Search suggestions based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = locationDatabase.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        (location.taluka && location.taluka.toLowerCase().includes(query.toLowerCase())) ||
        (location.district && location.district.toLowerCase().includes(query.toLowerCase())) ||
        location.state.toLowerCase().includes(query.toLowerCase()) ||
        location.fullName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
      updateDropdownPosition();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleSuggestionSelect(suggestions[selectedIndex]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }
  };

    const handleSuggestionSelect = (suggestion) => {
    // Use just the city name for the API call, but show the full name in the input
    let cityName = suggestion.name;
    const displayName = suggestion.fullName;
    
    // Remove common suffixes that might cause API issues
    cityName = cityName.replace(/\s+(City|Town|Village|District|State)$/i, '');

    try {
      // Set the query state to show the full name
      setQuery(displayName);

      // Close suggestions
      setShowSuggestions(false);
      setSelectedIndex(-1);

      // Use a small delay to ensure state is updated, then update DOM and call onSearch
      setTimeout(() => {
        // Update the input field value directly to show the full name
        if (inputRef.current) {
          inputRef.current.value = displayName;

          // Force a re-render by triggering a change event
          const event = new Event('input', { bubbles: true });
          inputRef.current.dispatchEvent(event);

          // Focus the input field
          inputRef.current.focus();
        }

        // Call onSearch with just the city name for better API compatibility
        onSearch(cityName);
      }, 0);
    } catch (error) {
      console.error('Error in handleSuggestionSelect:', error);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };



  // Close suggestions when clicking outside and handle window resize
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the search container and the portal dropdown
      const isOutsideSearch = searchRef.current && !searchRef.current.contains(event.target);
      const isOutsideDropdown = !event.target.closest('.suggestions-dropdown');
      
      if (isOutsideSearch && isOutsideDropdown) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    const handleResize = () => {
      if (showSuggestions) {
        updateDropdownPosition();
      }
    };

    const handleScroll = () => {
      if (showSuggestions) {
        updateDropdownPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showSuggestions]);

  return (
    <div className="relative search-container z-50 transparent-black rounded-xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 card-transparent rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 search-input"
            disabled={loading || locationLoading}
            ref={inputRef}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && createPortal(
          <div 
            className="fixed card-transparent rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-[999999] suggestions-dropdown"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxWidth: '400px'
            }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.name}-${suggestion.state}-${index}`}
                onClick={() => {
                  handleSuggestionSelect(suggestion);
                }}
                className={`p-3 cursor-pointer transition-colors duration-200 flex items-center justify-between ${
                  index === selectedIndex
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {suggestion.taluka ? `${suggestion.taluka}, ` : ''}{suggestion.district ? `${suggestion.district}, ` : ''}{suggestion.state}, {suggestion.country}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to favorites functionality can be implemented here
                  }}
                  className="p-1 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200"
                >
                  <Star className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <button
            type="submit"
            disabled={loading || locationLoading || !query.trim()}
            className="px-4 sm:px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="hidden sm:inline">Search</span>
          </button>

          {onCurrentLocation && (
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={loading || locationLoading}
              className="px-3 sm:px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              title="Use current location"
            >
              {locationLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="hidden sm:inline">Current Location</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
