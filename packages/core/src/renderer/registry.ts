import type { ComponentType } from 'react';
// Layout
import { Row } from '../components/layout/Row';
import { Column } from '../components/layout/Column';
import { Grid } from '../components/layout/Grid';
// Display
import { Image } from '../components/display/Image';
import { Card } from '../components/display/Card';
import { Text } from '../components/display/Text';
import { Button } from '../components/display/Button';
// Overlay
import { Modal } from '../components/overlay/Modal';
import { BottomSheet } from '../components/overlay/BottomSheet';
// Form
import { Input } from '../components/form/Input';
import { Textarea } from '../components/form/Textarea';
import { Select } from '../components/form/Select';
import { Checkbox } from '../components/form/Checkbox';
import { Toggle } from '../components/form/Toggle';
// Feedback
import { Badge } from '../components/feedback/Badge';
import { Alert } from '../components/feedback/Alert';
import { Spinner } from '../components/feedback/Spinner';
import { Skeleton } from '../components/feedback/Skeleton';
import { Progress } from '../components/feedback/Progress';
// Navigation
import { Tabs } from '../components/navigation/Tabs';
import { Breadcrumb } from '../components/navigation/Breadcrumb';
import { Navbar } from '../components/navigation/Navbar';
// Data
import { Avatar } from '../components/data/Avatar';
import { Divider } from '../components/data/Divider';
import { Table } from '../components/data/Table';
import { Drawer } from '../components/data/Drawer';
import type { TimberNodeType } from '../types/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TIMBER_REGISTRY: Record<TimberNodeType, ComponentType<any>> = {
  // Layout
  Row, Column, Grid,
  // Display
  Image, Card, Text, Button,
  // Overlay
  Modal, BottomSheet,
  // Form
  Input, Textarea, Select, Checkbox, Toggle,
  // Feedback
  Badge, Alert, Spinner, Skeleton, Progress,
  // Navigation
  Tabs, Breadcrumb, Navbar,
  // Data
  Avatar, Divider, Table, Drawer,
};
