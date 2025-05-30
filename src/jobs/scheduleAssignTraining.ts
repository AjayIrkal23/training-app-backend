// jobs/assignTrainingsToUsers.ts
import { User } from "../models/User";
import { TrainingModule } from "../models/TrainingModule";

export const assignTrainingsToUsers = async () => {
  const trainings = await TrainingModule.find({});
  const users = await User.find({ active: true });
  const today = new Date();

  for (const user of users) {
    const existingIds = user.assignedTrainings.map((t) =>
      t.trainingId.toString()
    );

    // ✅ Assign new trainings if eligible
    for (const training of trainings) {
      const isDepartmentMatched = training.departments.includes(
        user.department
      );
      const isDesignationMatched = training.designations.includes(
        user.designation
      );

      if (!isDepartmentMatched || !isDesignationMatched) continue;

      if (!existingIds.includes(training.trainingId.toString())) {
        user.assignedTrainings.push({
          trainingId: training.trainingId,
          status: "assigned",
          score: 0,
        });
      }
    }

    // ✅ Update existing assigned trainings if overdue
    for (const at of user.assignedTrainings) {
      const training = trainings.find((t) => t.trainingId === at.trainingId);

      if (
        training &&
        training.completionDate &&
        new Date(training.completionDate) < today &&
        at.status !== "completed"
      ) {
        at.status = "delayed";
      }
    }

    await user.save();
  }

  console.log("✅ Trainings assigned & overdue trainings marked as delayed.");
};
