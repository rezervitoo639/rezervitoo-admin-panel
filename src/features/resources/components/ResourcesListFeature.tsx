import { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
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
    const keys: Record<ResourceType, string> = {
      amenities: "resources.labels.amenity",
      restrictions: "resources.labels.restriction",
      nearby: "resources.labels.nearby",
      beds: "resources.labels.bedType",
    };
    return t(keys[resourceType]);
  };

  const getLocalizedName = (item: Resource): string => {
    if (i18n.language === "ar")
      return item.name_ar || item.name_en || item.name;
    if (i18n.language === "fr")
      return item.name_fr || item.name_en || item.name;
    return item.name_en || item.name;
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
              title: t("common.success"),
              message: t("resources.form.updateSuccess"),
              color: "green",
            });
            handleCloseModal();
          },
          onError: () => {
            notifications.show({
              title: t("common.error"),
              message: t("resources.form.updateError"),
              color: "red",
            });
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          notifications.show({
            title: t("common.success"),
            message: t("resources.form.createSuccess"),
            color: "green",
          });
          handleCloseModal();
        },
        onError: () => {
          notifications.show({
            title: t("common.error"),
            message: t("resources.form.createError"),
            color: "red",
          });
        },
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(t("resources.form.deleteConfirm", { name }))) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          notifications.show({
            title: t("common.success"),
            message: t("resources.form.deleteSuccess"),
            color: "orange",
          });
        },
        onError: () => {
          notifications.show({
            title: t("common.error"),
            message: t("resources.form.deleteError"),
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
          <p>
            {t("resources.form.noItems", {
              type: t(`resources.tabs.${resourceType}`),
            })}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {resources.map((item: Resource) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardContent}>
                {item.icon && (
                  <div className={styles.iconPreview}>
                    <img src={item.icon} alt={item.name_en || item.name} />
                  </div>
                )}
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{getLocalizedName(item)}</h3>
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
                  onClick={() => handleDelete(item.id, getLocalizedName(item))}
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
            ? t("resources.form.editTitle", { label: getResourceLabel() })
            : t("resources.form.addTitle", { label: getResourceLabel() })
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
