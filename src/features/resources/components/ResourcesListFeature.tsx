import { useState, forwardRef, useImperativeHandle } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Loader from "../../../components/Loader/Loader";
import Modal from "../../../components/Modal/Modal";
import ResourceForm from "./ResourceForm";
import { notifications } from "../../../utils/notifications";
import {
  useResources,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from "../hooks/useResources";
import type { ResourceType } from "../hooks/useResourceFilters";
import type {
  Amenity,
  Restriction,
  Nearby,
  BedType,
} from "../../../types/resource.types";
import styles from "../../../pages/Resources/ResourcesPage.module.css";

type Resource = Amenity | Restriction | Nearby | BedType;

interface ResourcesListFeatureProps {
  resourceType: ResourceType;
}

export interface ResourcesListRef {
  openModal: (item?: Resource) => void;
}

const ResourcesListFeature = forwardRef<
  ResourcesListRef,
  ResourcesListFeatureProps
>(({ resourceType }, ref) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Resource | null>(null);

  const { data: resources = [], isLoading } = useResources(resourceType);
  const createMutation = useCreateResource(resourceType);
  const updateMutation = useUpdateResource(resourceType);
  const deleteMutation = useDeleteResource(resourceType);

  useImperativeHandle(ref, () => ({
    openModal: (item?: Resource) => {
      handleOpenModal(item);
    },
  }));

  const getResourceLabel = () => {
    const labels: Record<ResourceType, string> = {
      amenities: "Amenity",
      restrictions: "Restriction",
      nearby: "Nearby Location",
      beds: "Bed Type",
    };
    return labels[resourceType];
  };

  const handleOpenModal = (item?: Resource) => {
    setEditingItem(item || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = (data: FormData) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            notifications.show({
              title: "Updated Successfully",
              message: `${getResourceLabel()} has been updated.`,
              color: "green",
            });
            handleCloseModal();
          },
          onError: () => {
            notifications.show({
              title: "Error",
              message: `Failed to update ${getResourceLabel().toLowerCase()}.`,
              color: "red",
            });
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          notifications.show({
            title: "Created Successfully",
            message: `${getResourceLabel()} has been created.`,
            color: "green",
          });
          handleCloseModal();
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: `Failed to create ${getResourceLabel().toLowerCase()}.`,
            color: "red",
          });
        },
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          notifications.show({
            title: "Deleted Successfully",
            message: `${getResourceLabel()} has been deleted.`,
            color: "orange",
          });
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: `Failed to delete ${getResourceLabel().toLowerCase()}.`,
            color: "red",
          });
        },
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      {resources.length === 0 ? (
        <div className={styles.empty}>
          <p>No {resourceType} found. Create one to get started.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {resources.map((item: Resource) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardContent}>
                {item.icon && (
                  <div className={styles.iconPreview}>
                    <img src={item.icon} alt={item.name} />
                  </div>
                )}
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{item.name}</h3>
                  <p className="entity-id">ID: {item.id}</p>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleOpenModal(item)}
                  title="Edit"
                >
                  <IconEdit size={18} />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(item.id, item.name)}
                  title="Delete"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          editingItem
            ? `Edit ${getResourceLabel()}`
            : `Add ${getResourceLabel()}`
        }
      >
        <ResourceForm
          editingItem={editingItem}
          resourceLabel={getResourceLabel()}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </>
  );
});

export default ResourcesListFeature;
