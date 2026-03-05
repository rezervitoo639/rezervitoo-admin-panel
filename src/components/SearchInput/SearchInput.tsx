import { IconSearch } from "@tabler/icons-react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxWidth?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  maxWidth = "300px",
}: SearchInputProps) {
  return (
    <div className={styles.searchContainer} style={{ maxWidth }}>
      <IconSearch size={16} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
